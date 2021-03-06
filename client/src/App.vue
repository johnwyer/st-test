<template>
  <div id="app">
    <app-filter 
      :app-filters="filter" 
      @filterChange="filterData"
      @filterReset="filterReset"
    ></app-filter>
    <app-grid 
      @itemsListUpdated="itemsList"        
    ></app-grid>
  </div>
</template>

<script>
import { _ } from "vue-underscore";
import AppFilter from "@/views/Filter.vue";
import AppGrid from "@/views/Grid.vue";
import { eventEmitter } from "./main";
import axios from 'axios';

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
      loading: true,
      errored: false
    };
  },
  watch: {
    itemsList(val) {
      eventEmitter.$emit("itemsListUpdated", val);
    }
  },
  methods: {
    onOpenModal(item){
      this.filter.showItem.selected = item.id;
      this.updateQueryString();
      eventEmitter.$emit("modalOpen", item);
    },
    onCloseModal(){
      this.filter.showItem.selected = '';
      this.updateQueryString();
      eventEmitter.$emit("modalClose");
    },
    filterList(){
      let items = [ ...this.itemsListBase ];
      let queryString = {};

      //check sort byId
      if (this.filter.byId.selected === "" || this.filter.byId.selected === "asc") {
        items = items.sort((a, b) => (a.id > b.id) ? 1 : -1);
        queryString.byId = 'asc';
      } else {
        items = items.sort((a, b) => (a.id < b.id) ? 1 : -1);        
        queryString.byId = 'desc';
      }    

      //check filter byType
      if (this.filter.byType.selected !== '' && this.filter.byType.values.includes(Number(this.filter.byType.selected))) { 
        items = _.filter(items, (item) => {
          return item.type == this.filter.byType.selected;
        });
        queryString.byType = this.filter.byType.selected;
      }

      //check filter byYear
      if (this.filter.byYear.selected !== '' && this.filter.byYear.values.includes(this.filter.byYear.selected)) {
        items = items.filter((item) => {
          return item.date.split('-')[0] == this.filter.byYear.selected;
        });
        queryString.byYear = this.filter.byYear.selected;
      }

      //check filter for modal
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
        queryString.showItem = modalItem.id;
        this.$nextTick(() => {
          this.onOpenModal(modalItem);
        });
      } else {
        this.filter.showItem.selected = '';
        queryString.showItem = '';
      }
      
      this.itemsList = items;

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
      const data = JSON.parse(JSON.stringify(this.json));
      //init items list
      this.itemsList = Object.keys(data).map(key => {
        return data[key];
      });
      this.itemsListBase = [ ...this.itemsList ];

      //init filter values
      let years = [""];
      this.itemsList.forEach((item) => {
        !this.filter.byType.values.includes(item.type) ? this.filter.byType.values.push(item.type) : '';
        !years.includes(item.date.split("-")[0]) ? years.push(item.date.split("-")[0]) : '';
      });
      this.filter.byYear.values = _.sortBy(years);
    },    
    initQueryString(){      
      const query = this.$route.query;
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
              this.filter[key].selected = query[key];
            }
          }          
        });

        isUpdated ? this.filterList() : '';
      }
    },
    getQueryString(){
      let queryParams = {};
      const filterQueryParams = Object.keys(this.filter);      
      filterQueryParams.forEach((key) => {          
        queryParams[key] = this.filter[key].selected;
      });

      return queryParams;
    },
    updateQueryString(){
      const query = this.getQueryString();
      this.$router.push({ 
        name: 'home', 
        query: Object.assign({}, this.$route.query, query)
      });
    }
  },  
  computed: {},
  components: {
    AppFilter,
    AppGrid
  },
  created(){
    eventEmitter.$on("onModalOpen", (item) => {
      this.onOpenModal(item);
    });
    eventEmitter.$on("onModalClose", () => {
      this.onCloseModal();
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
      .catch(() => {
        this.errored = true;
      })
      .finally(() => {
        this.loading = false;
      });
    
  }
};
</script>