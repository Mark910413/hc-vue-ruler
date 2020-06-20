<p align="middle" ><img src="https://raw.githubusercontent.com/Mark910413/hc-react-ruler/master/example.png"/></p>
<h2 align="middle">Hc React Ruler</h2>

## Installation
### npm
```sh
$ npm i hc-vue-ruler
```

## 🚀 How to use
```javascript
<template>
  <div class="wrapper">
    <span class="num">{{val}}</span>
    <Ruler :options="options" :value="val" @change="changeVal" />
  </div>
</template>

<script type="text/ecmascript-6">
import Ruler from '../../src/index.vue';
export default {
  name: "App",
  data() {
    return {
      options: {
        rate: 3,
        height: 50,
        start: 0,
        end: 100,
        capacity: 1,
        unit: 15,
        centerLine: { linecolor: '#3ECEB6', width: '1', height: '0.8'},
        scaleplate: { color: '#D8D8D8', fontsize: '14', width: '1', fontcolor: '#D8D8D8', halfLineHeight: '0.4', lineHeight: '0.3', fullLineHeight: '0.6'},
        value: 10
      },
      val: 0,
    };
  },
  created() {},
  methods: {
    changeVal(val) {
      this.val = val;
    }
  },
  components: {
    Ruler,
  }
};
</script>

<style>
body{
  padding: 0;
  margin: 0;
}
.num{
  display: block;
  width: 100%;
  line-height: 50px;
  font-size: 32px;
  text-align: center;
  font-weight: 600;
  color: #3ECEB6;
  border: none;
  outline: none;
}
</style>

```
	
	
## ⭐️ Show Your Support
Please give a ⭐️ if this project helped you!
