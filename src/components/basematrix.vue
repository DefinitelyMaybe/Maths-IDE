<template>
  <div v-on:mouseover="onMouseOver"
    v-on:mouseleave="onMouseLeave">
    <table>
      <tbody>
        <tr v-for="row in entries">
          <td v-for="entry in row">{{createFrom(entry)}}
          </td>
        </tr>
      </tbody>
    </table>
    <button id="rowButton" v-show="buttonsShown" v-on:click="addRow">add row</button>
    <button id="colButton" v-show="buttonsShown" v-on:click="addColumn">add Column</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import number from './basenumber.vue';
import variable from './basevariable.vue';

export default Vue.extend({
  name: 'base-matrix',
  components: {
    number,
    variable,
  },
  data() {
    return {
      rows: 1,
      columns: 1,
      entries: [[1]],
      buttonsShown: false,
    }
  },
  methods: {
    createFrom(entry: any) {
      try {
        let x = parseFloat(entry)
        // create a unmber
      } catch (error) {
        
      }
    },
    addRow() {
      let x = []
      for (let i = 0; i < this.$data.columns; i++) {
        x[i] = 1;
      }
      this.$data.entries.push(x);
      this.$data.rows += 1;
    },
    addColumn() {
      for (let row = 0; row < this.$data.rows; row++) {
        this.$data.entries[row].push(1)
      }
      this.$data.columns += 1;
    },
    onMouseOver() {
      this.$data.buttonsShown = true;
    },
    onMouseLeave() {
      this.$data.buttonsShown = false;
    },
    entryClicked() {

    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: block;
}

table {
  margin: 1px;
  color: black;
  border: 1px solid black;
  border-top: 0px;
  border-bottom: 0px;
}

td:hover {
  background: #dfdfdf;
}
button {
  position: absolute;
}

#colButton {
  left: 0px;
  top: 0px;
  /*bottom: 0px;*/
}

</style>
