<template>
  <div
    class="sidebar-button"
    :class="{'openSidebar': isSidebarOpen, 'isNotMobile':!isMobile}"
    @click="handleClick"
    v-if="!$page.frontmatter.home"
  >
    <!-- v-if="isMobile" -->
    <svg
      class="icon"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      viewBox="0 0 448 512"
    >
      <path
        fill="currentColor"
        d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"
        class
      />
    </svg>
    <!-- <div class="toggle--push" v-else>
      <input type="checkbox" id="toggle--push" class="toggle--checkbox" v-model="isSidebarOpen" />
      <label
        class="toggle--btn"
        for="toggle--push"
        data-label-on="on"
        data-label-off="off"
        @click="handleClick"
      ></label>
      {{isSidebarOpen}}
    </div>-->
  </div>
</template>
<script>
import { isMobile } from "../util";
export default {
  data() {
    return {
      isSidebarOpen: false,
      isMobile: false
    };
  },
  methods: {
    handleClick() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.$emit("toggle-sidebar");
    }
  },
  mounted() {
    this.isMobile = isMobile();
  }
};
</script>

<style lang="stylus">
.sidebar-button {
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  padding: 0.6rem;
  top: 0.6rem;
  left: 1rem;
  color: $accentColor;

  &.isNotMobile {
    left: unset;
    // background-color: #fff;
    right: 1.5rem;
    top: 4rem;
  }

  .icon {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
  }
}

@media (max-width: $MQMobile) {
  .sidebar-button {
    display: block;
  }
}
</style>
<style lang="stylus">
input {
  font-family: sans-serif;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  overflow: visible;
}

[type=checkbox] {
  box-sizing: border-box;
  padding: 0;
}

.toggle--checkbox {
  display: none;
}

.toggle--btn, .toggle--btn:before, .toggle--btn:after, .toggle--checkbox, .toggle--checkbox:before, .toggle--checkbox:after {
  transition: all 250ms ease-in;
}

.toggle--btn {
  display: block;
  margin: 0 auto;
  font-size: 1.4em;
}

.toggle--btn:hover {
  cursor: pointer;
}

.toggle--btn, .toggle--btn:before, .toggle--btn:after, .toggle--checkbox, .toggle--checkbox:before, .toggle--checkbox:after {
  transition: all 250ms ease-in;
}

.toggle--btn:before, .toggle--btn:after, .toggle--checkbox:before, .toggle--checkbox:after {
  content: '';
  display: block;
}

.toggle--btn, .toggle--btn:before, .toggle--btn:after {
  transition: all 250ms ease-in;
}

.toggle--push {
  transform: scale(0.7);
}

.toggle--push .toggle--btn {
  position: relative;
  width: 50px;
  height: 50px;
  background-color: #f9f8f6;
  border-radius: 50%;
  box-shadow: 0 2px 6px 0 #333, 0 12px 15px 0 #ccc;
}

.toggle--push .toggle--btn, .toggle--push .toggle--btn:before, .toggle--push .toggle--btn:after {
  transition-duration: 150ms;
}

.toggle--push .toggle--btn:before {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22.72727px;
  height: 22.72727px;
  border-radius: 50%;
  background-color: #f90;
  box-shadow: inset 0 0 0 5px #ccc, inset 0 0 0 14px #f9f8f6;
}

.toggle--push .toggle--btn:after {
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 12px;
  background-color: #ccc;
  box-shadow: 0 0 0 2.5px #f9f8f6;
}

.toggle--push .toggle--btn:hover:before {
  box-shadow: inset 0 0 0 5px #b3b3b3, inset 0 0 0 14px #f9f8f6;
}

.toggle--push .toggle--btn:hover:after {
  background-color: #b3b3b3;
}

.toggle--push .toggle--checkbox:checked+.toggle--btn {
  box-shadow: 0 2px 5px 0 gray, 0 15px 20px 0 transparent;
}

.toggle--push .toggle--checkbox:checked+.toggle--btn:before {
  box-shadow: inset 0 0 0 5px #f90, inset 0 0 0 14px #f9f8f6;
}

.toggle--push .toggle--checkbox:checked+.toggle--btn:after {
  background-color: #f90;
}
</style>