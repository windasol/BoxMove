<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  list: Array<string>;
  width?: string;
  height?: string;
  id: string;
}>()

const mouseFlag = ref(false);
const initX = ref(0);
const flipX = ref(0);
const flipTime = ref(0);
const speedArr = ref([{}]);
const translate = ref(0);
const opacity = ref(100);
const transition = ref('');
const mouseMoveFlag = ref(false);
const transitionColor = ref('');
const interval = ref();
const colorList = props.list;
const idx = ref(0);
const status = ref('AUTO TRANSITION');
const fullWidth = ref(0);
const translateBind = computed(() => `translate3d(${translate.value}px, 0px, 0px)`);
const opacityBind = computed(() => `${opacity.value}%`);

// pc 마우스 move 이벤트
document.addEventListener('mousemove', function(event: MouseEvent) {
  const x = event.clientX;
  boxMove(x);
})

// pc 마우스 up 이벤트
document.addEventListener('mouseup', function() {
  boxEnd();
})

// 움직일때 투명도 설정
function calOpacity() {
  let rate = translate.value
  if (translate.value < 0) {
    rate = toPositiveNumber(rate);
  }

  return 100 - rate / 4;
}

// 음수일경우 양수로 변환
function toPositiveNumber(item: number) {
  return Math.abs(item);
}

// 다음 색깔 지정 (idx가 최대 일 경우 0으로, 아닐시 +1)
function afterColor() {
  return idx.value == colorList.length - 1
    ? colorList[0]
    : colorList[idx.value + 1];
}

// 마우스 클릭시 alert창
function alertfunction() {
  if (!mouseMoveFlag.value) {
    alert('CLICK : ' + colorList[idx.value]);
    status.value = 'CLICK : ' + colorList[idx.value]
  }
}

// auto transition
function autoTransition() {
  transitionColor.value = afterColor()
  transition.value = '0.3s ease 0s';
  translate.value = fullWidth.value;
  idx.value = idx.value === colorList.length - 1 ? 0 : idx.value + 1;
  status.value = 'AUTO TRANSITION';
  opacity.value = 0;
}

onMounted(() => {
  interval.value = setInterval(autoTransition, 3000);
  fullWidth.value = document.getElementById(props.id)!.offsetWidth ?? 0;
})

// pc 마우스 start
function mouseStart(event: MouseEvent) {
  const x = event.clientX;
  boxStart(x);
}

// pc 마우스 end
function mouseEnd() {
  interval.value = setInterval(autoTransition, 3000);
}

// 모바일 터치 move
function touchmove(event: TouchEvent) {
  const x = event.touches[0].clientX;
  boxMove(x);  
}

// 모바일 터치 start
function touchstart(event: TouchEvent) {
  const x = event.touches[0].clientX;
  boxStart(x);  
}

// 모바일 터치 end
function touchend() {
  boxEnd();
  interval.value = setInterval(autoTransition, 3000);
}

// 상자 클릭 시 이벤트
function boxStart(x: number) {
  translate.value = 0;
  initX.value = x;
  flipX.value = x;
  flipTime.value = new Date().getTime();
  transition.value = '0s';
  mouseFlag.value = true;
  clearInterval(interval.value);
}

// slide 시 TO, FLIP 구분
function slideType(type: string) {
  translate.value = translate.value < 0 ? -fullWidth.value : fullWidth.value;
  idx.value = idx.value === colorList.length - 1 ? 0 : idx.value + 1;
  status.value = translate.value < 0 ? `${type} LEFT` : `${type} RIGHT`;
  opacity.value = 0;
}

// 상자 클릭 end 이벤트
function boxEnd() {
  const time = new Date().getTime();  
  transition.value = '0.3s ease 0s';
  if (mouseFlag.value) {        
    const flip = speedArr.value.filter((e:any) => time - 10 <= e.time ).filter((e:any) => e.value >= 0.1).length;
    if (flip > 0) {
      slideType('FLIP')         
    } else {
      if (toPositiveNumber(translate.value) >= fullWidth.value / 2) {
        slideType('TO')
      } else {
        status.value = 'CANCEL';
        translate.value = 0;
        opacity.value = 100;
      }
    }
  }

  speedArr.value = [];
  mouseFlag.value = false;
}

// 상자 클릭 움직임 이벤트
function boxMove(x: number) {  
  if (mouseFlag.value) { 
    flip(x);
    const distance = x - initX.value;
    transitionColor.value = afterColor();
    if (status.value.startsWith('SWIPE')) {
      if (status.value == 'SWIPE LEFT') {
        translate.value = distance > 0 ? 0 : x - initX.value;
      } else {
        translate.value = distance < 0 ? 0 : x - initX.value;
      }
    } else {
      translate.value = x - initX.value;
      status.value = translate.value < 0 ? 'SWIPE LEFT' : 'SWIPE RIGHT';
    }

    mouseMoveFlag.value = true;
    opacity.value = calOpacity();
  }
}

// trasnsition 끝 이벤트
function transitionEnd() {
  transition.value = '0s';
  translate.value = 0;
  opacity.value = 100;
  mouseMoveFlag.value = false;
}

// transition 시작 이벤트
function transitionStart() {
  if (status.value.startsWith('TO')) {
    transitionColor.value = colorList[idx.value];
  }
}

// 플립
function flip(x: number) {
  const time = new Date().getTime();
  const arrDistance = toPositiveNumber(x - flipX.value);
  const arrTime = time - flipTime.value;
  const arrSpeed = arrDistance / arrTime;  
  speedArr.value.push({time: time, value: arrSpeed});
  flipTime.value = time;
  flipX.value = x;    
}

</script>

<template>
    <div class="wrap-card svelte-1anl9sr" :style="props.width">          
      <div class="blackText">{{ status }}</div>
      <div
        class="card-wrapper svelte-1oijsep"
        :style="props.height"
        @click="alertfunction"
        @mousedown="mouseStart"
        @mouseup="mouseEnd"
        @touchmove="touchmove"
        @touchstart="touchstart"
        @touchend="touchend"
        @transitionend="transitionEnd"
        @transitionstart="transitionStart"
      >
        <div class="card svelte-1oijsep" :style="{ backgroundColor: transitionColor }">
          <div class="card-inner svelte-1oijsep">{{ transitionColor }}</div>
        </div>
        <div
          :id="props.id"
          class="card svelte-1oijsep"
          :style="{
            transform: translateBind,
            opacity: opacityBind,
            transition: transition,
            backgroundColor: colorList[idx]
          }"
          draggable="false"
        >
          <div class="card-inner svelte-1oijsep">{{ colorList[idx] }}</div>
        </div>
        <div class="gesture-recognizer svelte-p8tcev" style="left: 0px; top: 0px"></div>
      </div>
    <div class="grayText" draggable="false">{{ colorList }}</div>
    </div>
</template>

<style scoped>
.blackText {
  text-align: center;
  color: black;
}

.grayText {
  text-align: center;
  color: gray;
}

.card,
.card:active {
  cursor: pointer;
}
</style>
