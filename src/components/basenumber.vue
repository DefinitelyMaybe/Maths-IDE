<template>
    <div>
        <div v-on:click="edit"
        v-show="!this.$data.seen">{{value}}</div>
        <input v-on:keyup.enter="finishEdit"
            v-on:blur="finishEdit"
            autofocus
            onfocus="this.value = this.value;"
            v-model="value"
            v-show="this.$data.seen"
            type="number"
            onkeypress="this.style.width = (this.value.length + 1) + 'ch';"
            v-bind:style="styleObj">
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'base-number',
    props: {
        setValue: String,
    },
    data() {
        return {
            value: "1",
            seen: false,
            styleObj: {
                width: "1ch"
            }
        }
    },
    methods: {
        edit() {
            this.$data.seen = true;
        },
        finishEdit() {
            this.$data.seen = false;
        }
    },
    created() {
        try {
            if (this.$props.setValue) {
                let x = parseFloat(this.$props.setValue).toString();
                this.$data.value = x;
                this.$data.styleObj.width = x.toString().length + "ch";
            }
        } catch (error) {
            
        }
    }
});
</script>

<style scoped>
input {
    border: none;
    padding: 0px;
    outline: none;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>
