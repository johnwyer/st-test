<template>
  <div id="app">

      <app-filter 
        :app-filters.sync="filter" 
        @filterChange="filterData"
        @filterReset="filterReset"
      ></app-filter>
      <router-view>
      <app-grid 
        @itemsListUpdated="itemsList"        
      ></app-grid>
      </router-view>      

  </div>
</template>

<script>
import { _ } from "vue-underscore";
import AppFilter from "@/views/Filter.vue";
import AppGrid from "@/views/Grid.vue";
import { eventEmitter } from "./main";

const axios = require('axios');

export default {
  name: "app",
  data() {
    return {
      json: {},
      itemsList: [],
      itemsListBase: [],
      filter: {
        byId: {
          selected: "asc",
          values: ["asc", "desc"]
        },
        byType: {
          selected: '',
          values: ['']
        },
        byYear: {
          selected: '',
          values: ['']
        },
        showItem: {
          selected: ''
        }
      },
      //queryStringItems:['byId', 'byType', 'byYear', 'showItem'],
      loading: true,
      errored: false
    };
  },
  watch: {
    itemsList(val) {
      // eslint-disable-next-line
      console.log("App.vue watch itemsList ", val);
      eventEmitter.$emit("itemsListUpdated", val);
    }
  },
  methods: {
    dialogShow(item){
      // eslint-disable-next-line
      console.log('App.vue dialogShow() ', item);
      this.filter.showItem.selected = item.id;
      this.updateQueryString();
      eventEmitter.$emit("modalOpen", item);
    },
    dialogHide(){
      // eslint-disable-next-line
      //console.log('App.vue dialogHide() ');
      this.filter.showItem.selected = '';
      this.updateQueryString();
      eventEmitter.$emit("modalClose");
    },
    filterList(){
      let items = [ ...this.itemsListBase ];
      let queryString = {};

      if (this.filter.byId.selected === "" || this.filter.byId.selected === "asc") {
        items = items.sort((a, b) => (a.id > b.id) ? 1 : -1);
        queryString.byId = 'asc';
      } else {
        items = items.sort((a, b) => (a.id < b.id) ? 1 : -1);        
        queryString.byId = 'desc';
      }    

      if (this.filter.byType.selected !== '' && this.filter.byType.values.includes(this.filter.byType.selected)) { 
        items = _.filter(items, (item) => {
          return item.type == this.filter.byType.selected;
        });
        queryString.byType = this.filter.byType.selected;
      }

      if (this.filter.byYear.selected !== '' && this.filter.byYear.values.includes(this.filter.byYear.selected)) {
        items = items.filter((item) => {
          return item.date.split('-')[0] == this.filter.byYear.selected;
        });
        queryString.byYear = this.filter.byYear.selected;
      }

      let showModal = false;
      let modalItem = {};
      if (this.filter.showItem.selected !== '') {
        items.forEach((item) => {
          if(Number(item.id) === Number(this.filter.showItem.selected) && Number(item.type) === 2){
            showModal = true;
            modalItem = item;            
          }
        });
      }
           
      if(showModal) {            
        //this.filter.showItem.selected = modalItem.id;
        // eslint-disable-next-line
        //console.log("App.vue filterList ", showModal, modalItem, this.filter.showItem.selected, eventEmitter);
        queryString.showItem = modalItem.id;
        this.$nextTick(() => {
          this.dialogShow(modalItem);
        });
      } else {
        this.filter.showItem.selected = '';
        queryString.showItem = '';
      }
      
      this.itemsList = items;
      // eslint-disable-next-line 
      console.log("App.vue filterList queryString ", queryString);

      if(Object.keys(queryString).length !== 0) {
        this.updateQueryString();
      }
    },
    filters(type, value) {
      if (type === "byId") {
        this.filter.byId.selected = value === "" ? "asc" : value;
      }
      if (type === "byType") {
        this.filter.byType.selected = this.filter.byType.values.includes(Number(value)) ? Number(value) : '';
      }
      if(type === 'byYear') {
        this.filter.byYear.selected = this.filter.byYear.values.includes(value) ? value : '';
      }

      this.filterList();
    },
    filterData(type, event) {
      let _event = event || window.event;
      let target = _event.target || _event.srcElement;

      this.filters(type, target.value);
    },
    filterReset(){
      this.filter.byId.selected = 'asc';
      this.filter.byType.selected = '';
      this.filter.byYear.selected = '';
      this.filter.showItem.selected = '';
      this.filterList();
    },
    initData() {
      let data = JSON.parse(JSON.stringify(this.json));
      //init items list
      this.itemsList = Object.keys(data).map(key => {
        return data[key];
      });
      this.itemsListBase = [ ...this.itemsList ];

      //prepare filter values
      let years = [""];
      this.itemsList.forEach(item => {
        if (!this.filter.byType.values.includes(item.type)) {
          this.filter.byType.values.push(item.type);
        }
        if (!years.includes(item.date.split("-")[0])) {
          years.push(item.date.split("-")[0]);
        }
      });
      this.filter.byYear.values = _.sortBy(years);
    },    
    initQueryString(){      
      /* eslint-disable */
      let query = this.$route.query;
      if(Object.keys(query).length === 0) {
        const routerQueryParams = this.getQueryString();

        this.$router.push({ 
          name: 'home', 
          query: Object.assign({}, this.$route.query, routerQueryParams)
        });
      } else {
        const filterQueryParams = Object.keys(this.filter);      
        let isUpdated = false;

        filterQueryParams.forEach((key) => {
          if(query.hasOwnProperty(key)) {            
            if(query[key] != this.filter[key].selected) {
              isUpdated = true;
              console.log(`query key `, key, query[key], this.filter[key].selected);
              this.filter[key].selected = query[key];
            }
          }          
        });

        isUpdated ? this.filterList() : '';
      }
    },
    getQueryString(){
      const queryParams = {};
      const filterQueryParams = Object.keys(this.filter);      
      filterQueryParams.forEach((key) => {          
        queryParams[key] = this.filter[key].selected;
      });

      return queryParams;
    },    
    updateQueryString(){
      /* eslint-disable */
      console.log('App.vue updateQueryString()');
      let query = this.getQueryString();
      this.$router.push({ 
        name: 'home', 
        query: Object.assign({}, this.$route.query, query)
      });
    }
  },  
  computed: {},
  components: {
    appFilter: AppFilter,
    appGrid: AppGrid
  },
  beforeMount: function() {
    /*
    axios.get(`/api/data/data`)
      .then((response) => {
        //console.log(response.data);
        this.json = response.data;
      });     
      */
  },
  created(){
    eventEmitter.$on("dialogShow", (item) => {
      this.dialogShow(item);
    });
    eventEmitter.$on("dialogHide", () => {
      this.dialogHide();
    });    
  }, 
  mounted(){
    axios
      .get(`/api/data/data`)
      .then((response) => {
        this.json = response.data;
        this.initData();
        this.initQueryString(); 
      })
      .catch((error) => {
        this.error = true;
      })
      .finally(() => {
        this.loading = false;
      });
    
  }
};
</script>