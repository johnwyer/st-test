<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-lg-3 col-md-6 col-12 col-filter">
        <form class="form-inline">
          <div class="form-group">
            <label for="filterById">By ID</label>
            <select 
              class="form-control" 
              id="filterById" 
              @change="changeFilter('byId', $event)"
              :value="filter.byId.selected"              
            >
              <option 
                :key="index"
                v-for="(item, index) in filter.byId.values"              
                :value="item"
                :selected="item == filter.byId.selected"
              >{{item}}</option>
            </select>
          </div>
        </form>
      </div>
      <div class="col-lg-3 col-md-6 col-12 col-filter">
        <form class="form-inline">
          <div class="form-group">
            <label for="filterByType">By Type</label>
            <select 
              class="form-control" 
              id="filterByType" 
              ref="filterByType"
              @change="changeFilter('byType', $event)"
              :value="filter.byType.selected"
            >
              <option 
                :key="item.id"
                v-for="(item) in filterType"              
                :value="item.id"
                :selected="item.id == filter.byType.selected"
              >{{item.title}}</option>
            </select>
          </div>
        </form>
      </div>   
      <div class="col-lg-3 col-md-6 col-12 col-filter">
        <form class="form-inline">
          <div class="form-group">
            <label for="filterByYear">By Year</label>
            <select 
              class="form-control" 
              id="filterByYear" 
              ref="filterByYear"
              @change="changeFilter('byYear', $event)"
              :value="filter.byYear.selected"
            >
              <option 
                :key="index"
                v-for="(item, index) in filter.byYear.values"              
                :value="item"
                :selected="item == filter.byYear.selected"
              >{{item}}</option>
            </select>
          </div>
        </form>
      </div> 
      <div class="col-lg-3 col-md-6 col-12 col-filter">
        <form class="form-inline">
          <div class="form-group">
            <button class="btn btn-primary" @click.prevent="resetFilter">Reset Filter</button>
          </div>
        </form>
      </div>                
    </div>
  </div>
</template>

<script>
export default {
  props: {    
    appFilters: Object
  },
  data() {
    return {
      filter: this.appFilters,
      filterType: [
        { id: 0, title: '' },
        { id: 1, title: 'Image' }, 
        { id: 2, title: 'Video' }
      ]
    }
  },
  watch: {
    'filter.byYear.selected'(value){
      value === '' ? this.$refs.filterByYear.value = '' : '';
    },
    'filter.byType.selected'(value){
      value === '' ? this.$refs.filterByType.value = '' : '';
    }
  },
  components: {
  },
  methods: {
    resetFilter(){
      this.$emit('filterReset');
    },
    changeFilter(type, event){
      if(type === 'byId' && (String(event.target.value) !== String(this.filter.byId.selected))){
        this.$emit('filterChange', type, event);
      }
      if(type === 'byType' && (String(event.target.value) !== String(this.filter.byType.selected))){
        this.$emit('filterChange', type, event);
      }
      if(type === 'byYear' && (String(event.target.value) !== String(this.filter.byYear.selected))){
        this.$emit('filterChange', type, event);
      }      
    }
  },
  created(){}
}
</script>