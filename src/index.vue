<template>
  <div className="ruler-dom">
    <canvas ref="canvas" id="ruler" :style="{width: '100%', display: 'block', height: '71px'}" />
  </div>
</template>

<script type="text/ecmascript-6">
import Ruler from './ruler.js';
export default {
  name: "App",
  props: ['options'],
  data() {
    return {
      data: {
        id: 231231
      }
    };
  },
  created() {
    
  },
  mounted() {
    this.drawRuler(this.options);
    console.log(this.options);
  },
  methods: {
      drawRuler(options) {
        const {height = 50, start = 0, end = 100, capacity = 1, value = 0, unit = 10, centerLine = {}, scaleplate = {}, onChange = () => {}, rate = 1} = options;
        /* eslint-disable no-new */
        this.ruler = new Ruler({
          elem: this.$refs.canvas,
          width: this.$refs.canvas.offsetWidth, // 画布宽
          height, // 画布高
          start, // 最小值
          end, // 最大值
          capacity, // 每个刻度代表值
          value, // 当前值
          unit, // 刻度距离
          centerLine, // 中心线
          scaleplate, // 刻度样式
          rate,
          onChange: (val) => {
            this.$emit('change', val);
          },
        });
      }
  }
};
</script>

<style></style>