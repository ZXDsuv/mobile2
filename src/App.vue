<script>
import {
  navigateTo
} from './utils/route'
export default {
  onLaunch: function () {
    navigateTo('/pages/login/index')
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
html {
  font-size: calc(100vw / 10) !important;
  /* 让 1rem = 192px */
}

.common-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
