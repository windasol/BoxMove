<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const underText = ref('purple');
const mouseFlag = ref(false);
const initX = ref(0);


const aboveTranslate = ref(0);
const aboveOpacity = ref(100);
const aboveTransition = ref('');
const filpFlag = ref(false);
const mouseMoveFlag = ref(false);
const transitionColor = ref('');

// 첫번쨰 상자
const aboveTranslateBind = computed(() => `translate3d(${aboveTranslate.value}px, 0px, 0px)`);
const aboveOpacityBind = computed(() => `${aboveOpacity.value}%`);
const codeOutput = computed(() => `transform: ${aboveTranslateBind.value}`);
const aboveColorList = ref(['red', 'orange', 'green', 'blue'])
const aboveIdx = ref(0);
const aboveStatus = ref('AUTO TRANSITION');

// 마우스 움직일 때
document.addEventListener('mousemove', function (event: MouseEvent) {       
  if (mouseFlag.value) {       
    const distance = event.x - initX.value;    
    transitionColor.value = afterColor();
    if (aboveStatus.value.startsWith('SWIPE')) {
      if(aboveStatus.value == 'SWIPE LEFT') {        
        aboveTranslate.value = distance > 0 ? 0 : event.x - initX.value;   
      } else {
        aboveTranslate.value = distance < 0 ? 0 : event.x - initX.value;   
      }
    } else {
      aboveTranslate.value = event.x - initX.value;   
      aboveStatus.value = aboveTranslate.value < 0 ? 'SWIPE LEFT' : 'SWIPE RIGHT'
    }
    
    mouseMoveFlag.value = true;    
    aboveOpacity.value = calOpacity();               
  }
  
}); 

// 마우스 땟을 때
document.addEventListener('mouseup', function() {     
  const width = document.getElementById('real').offsetWidth;      
  if (mouseFlag.value) {
    aboveTransition.value = '0.3s ease 0s';
    if (toPositiveNumber(aboveTranslate.value) >= width / 2) {        
      aboveTranslate.value = aboveTranslate.value < 0 ? -400 : 400;
      aboveIdx.value = aboveIdx.value === aboveColorList.value.length - 1 ? 0 : aboveIdx.value + 1;    
      aboveStatus.value = aboveTranslate.value < 0 ? 'TO LEFT' : 'TO RIGHT'
      aboveOpacity.value = 0;       
    } else {
      aboveStatus.value = 'CANCEL'
      aboveTranslate.value = 0;
      aboveOpacity.value = 100;   
    }     
  }
        
  mouseFlag.value = false;      
}); 

// 트랜지션 종료 시점
document.addEventListener('transitionend', function() {
  aboveTransition.value = '0s';
  aboveTranslate.value = 0;
  aboveOpacity.value = 100;  
});

// 트랜지션 시작 시점
document.addEventListener('transitionstart', function() {
  if (aboveStatus.value.startsWith('TO')) {
    transitionColor.value = aboveColorList.value[aboveIdx.value];
  }
});


// 마우스 클릭시 
function aboveMouseDown(event: MouseEvent) {      
  aboveTranslate.value = 0;
  initX.value = event.x;  
  aboveTransition.value = '0s';
  mouseFlag.value = true;  
}

// 움직일때 투명도 설정
function calOpacity() {
  let rate = aboveTranslate.value;
  if (aboveTranslate.value < 0) {
    rate = toPositiveNumber(rate);
  }

  return  (100 - (rate / 2.5));
}

// 음수일경우 양수로 변환
function toPositiveNumber(item: number) {
  return Math.abs(item);
}

// 다음 색깔 지정 (idx가 최대 일 경우 0으로, 아닐시 +1)
function afterColor() {
  return aboveIdx.value == aboveColorList.value.length - 1 ? aboveColorList.value[0] : aboveColorList.value[aboveIdx.value + 1];  
}

</script>

<template>
  <div class="wrapper svelte-1anl9sr" style="-webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
          user-select:none;" draggable="false">      
    filpFlag : {{ filpFlag}}     
    translateX: {{aboveTranslate}}
    init : {{initX}}
      <pre id="codeput">{{ codeOutput }}</pre>        
    <div class="title svelte-1anl9sr" style="text-align: center">Task</div>
    <div class="wrap-card svelte-1anl9sr">
      <div class="blackText">{{  aboveStatus  }}</div>
      <div class="card-wrapper svelte-1oijsep" style="height: 60px" @mousedown="aboveMouseDown($event)" @click="alertfunction">        
        <div class="card svelte-1oijsep" :style="{  backgroundColor: transitionColor}">
          <div class="card-inner svelte-1oijsep">{{ transitionColor }}</div>
        </div>        
        <div
          id="real"
          class="card svelte-1oijsep"        
          @after-enter="transitionComplete()"  
          :style="{ transform: aboveTranslateBind, opacity: aboveOpacityBind, transition: aboveTransition, backgroundColor: aboveColorList[aboveIdx] }"        
          draggable="false"                      
        >
          <div class="card-inner svelte-1oijsep">{{ aboveColorList[aboveIdx] }}</div>
        </div>
        <div class="gesture-recognizer svelte-p8tcev" style="left: 0px; top: 0px"></div>
      </div>
    </div>
    <div class="grayText" draggable="false">["red", "orange", "green", "blue"]</div>
    <div class="wrap-card svelte-1anl9sr" style="width: 50%">
      <div class="blackText">AUTO TRANSITION</div>
      <div class="card-wrapper svelte-1oijsep" style="height: 120px">
        <div class="card svelte-1oijsep" style="background-color: purple">
          <div class="card-inner svelte-1oijsep">{{ underText }}</div>
        </div>
        <div
          class="card svelte-1oijsep"
          style="background-color: indigo; transform: translate3d(0%, 0, 0); opacity: 1"
        >
          <div class="card-inner svelte-1oijsep">indigo</div>
        </div>
        <div class="gesture-recognizer svelte-p8tcev" style="left: 0px; top: 0px"></div>
      </div>
    </div>
    <div class="grayText">["indigo", "purple"]</div>
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
