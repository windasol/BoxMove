<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const underText = ref('purple');
const mouseFlag = ref(false);

const initX = ref(0);

const aboveTranslate = ref(0);
const aboveOpacity = ref(100);
const aboveTransition = ref('');

// 첫번쨰 상자
const aboveTranslateBind = computed(() => `translate3d(${aboveTranslate.value}px, 0px, 0px)`);
const aboveOpacityBind = computed(() => `${aboveOpacity.value}%`);
const codeOutput = computed(() => `transform: ${aboveTranslateBind.value}`);
const aboveColorList = ref(['red', 'orange', 'green', 'blue'])
const aboveIdx = ref(0);
const aboveStatus = ref('AUTO TRANSITION');


document.addEventListener('mousemove', function (event: MouseEvent) {       
  if (mouseFlag.value) {        
    aboveTranslate.value = event.x - initX.value;   
    aboveOpacity.value = calOpacity();    
    aboveStatus.value = aboveTranslate.value < 0 ? 'SWIPE LEFT' : 'SWIPE RIGHT'
  }
}); 


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

document.addEventListener('transitionend', function() {
  aboveTransition.value = '0s';
  aboveTranslate.value = 0;
  aboveOpacity.value = 100;
});


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

function afterColor() {
  if (aboveIdx.value == aboveColorList.value.length - 1) {
    return aboveColorList.value[0];
  } else {
    return aboveColorList.value[aboveIdx.value + 1];
  }
}

function beforeColor() {
  if (aboveIdx.value == 0) {
    return 3
  } else {
    return aboveIdx.value - 1;
  }
}

function behindColor() {  
  if (aboveStatus.value == 'CANCEL') {
    return aboveColorList.value[aboveIdx.value];
  } else {
    return aboveColorList.value[beforeColor()]
  }
}

</script>

<template>
  <div class="wrapper svelte-1anl9sr">            
    translateX: {{translateX}}
    init : {{initX}}
      <pre id="codeput">{{ codeOutput }}</pre>        
    <div class="title svelte-1anl9sr" style="text-align: center">Task</div>
    <div class="wrap-card svelte-1anl9sr">
      <div class="blackText">{{  aboveStatus  }}</div>
      <div class="card-wrapper svelte-1oijsep" style="height: 60px" @mousedown="aboveMouseDown($event)">        
        <div class="card svelte-1oijsep" :style="{  backgroundColor: afterColor() }">
          <div class="card-inner svelte-1oijsep" draggable="false">{{ afterColor() }}</div>
        </div>        
        <div
          id="real"
          class="card svelte-1oijsep"        
           @after-enter="transitionComplete()"  
          :style="{ transform: aboveTranslateBind, opacity: aboveOpacityBind, transition: aboveTransition, backgroundColor: aboveColorList[aboveIdx] }"        
          draggable="false"                 
        >
          <div class="card-inner svelte-1oijsep" draggable="false" style="-webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
          user-select:none;">{{ aboveColorList[aboveIdx] }}</div>
        </div>
        <div class="gesture-recognizer svelte-p8tcev" style="left: 0px; top: 0px"></div>
      </div>
    </div>
    <div class="grayText">["red", "orange", "green", "blue"]</div>
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
