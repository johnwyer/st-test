<template>
  <div class="container-fluid">
    <modal
      v-if="modal.open"
      v-on:close="beforeCloseModal"
      key="modal-auth"
      v-cloak
    >
      <div class="block">
        <video preload="auto" controls autoplay id="app-player">
          <source :src="modal.src" type="video/mp4">
        </video>
      </div>
    </modal>

    <div class="row">
      <div
        class="col-lg-3 col-md-4 col-12 col-item"
        v-for="(item) in itemsList"
        v-bind:key="item.id"
        :class="item.type === 2 ? 'has-video' : ''"
      >           
        <div class="item-wrapper">
          <div class="item-image">
            <div class="item-image-inner" :style="{'backgroundImage': `url('${item.thumb}')`}"></div>
            <div 
              class="item-play-video"
              v-if="item.type === 2" 
              @click="beforeOpenModal(item)">
              <span>
                <i class="material-icons">play_arrow</i>
              </span>
            </div>
          </div>
          <div class="item-title">{{ item.title }}</div>
          <div class="item-date">{{ item.date | moment("YYYY/MM/DD") }}</div>
        </div>  
   
      </div>
    </div>
  </div>
</template>

<script>
import { eventEmitter } from "../main";

export default {
  props: {
    items: Array
  },
  data() {
    return {
      itemsList: this.items,
      modal: {
        open: false,
        src: null
      }
    };
  },
  components: {
    modal: require("./Modal.vue").default
  },
  methods: {
    beforeOpenModal: function(item){
      eventEmitter.$emit('onModalOpen', item);
    },
    openModal: function(item) {
      this.modal.src = item.src;   
      this.modal.open = true;
    },
    beforeCloseModal: function(){
      eventEmitter.$emit('onModalClose');
    },
    closeModal: function() {
      this.modal.open = false;
      this.modal.src = null;
    }
  },
  created() {
    eventEmitter.$on("itemsListUpdated", (items) => {
      this.itemsList = items;
    });
    eventEmitter.$on("modalOpen", (item) => {
      this.openModal(item);
    });
    eventEmitter.$on("modalClose", () => {
      this.closeModal();
    });    
  },
  mounted() {}
};
</script>