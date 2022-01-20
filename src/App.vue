<template>
  <div id="main" v-cloak>
    <header class="headerHide">
        <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light box-shadow mb-3">
            <div class="container">
              <div class="title-nav-group">
                <h2 class="title-nav font-weight-bold">Shopping List</h2>
              </div>
            </div>
        </nav>
    </header> 
    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <footer class="border-top footer text-muted">
        <div class="container font-weight-bold">
            &copy; 2022 - Gim
        </div>
    </footer>    
    <!-- loading -->
    <div class="modal" id="Loading_dialog" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="d-flex justify-content-center">
                        <div class="spinner-grow" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div style="margin: 10px">
                        <h5 class="text-center">
                            <span>Loading...</span>
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal: Message -->    
    <div class="modal" id="messageModal" tabindex="-1" role="dialog" aria-labelledby="messageModalTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body" id="messageDiv">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary btn-sm" data-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */  // 禁用ESLint
import { routes } from "@/router";

export default {
  name: 'App',
  data() {
    return {
      activeLink: null,
    };
  },
  components: {
  },
  watch: {
    '$route.path'(n) {
        this.activeLink = n;
    }
  },
  mounted(){
    this.activeLink = this.$route.path;
  },
}
</script>

<style>

</style>
