<template>
  <div class="container">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
            <a class="nav-link active" id="Tab1-tab" data-toggle="tab" href="#Tab1" role="tab" aria-controls="Tab1" aria-selected="true">商品列表</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="Tab2-tab" data-toggle="tab" href="#Tab2" role="tab" aria-controls="Tab2" aria-selected="false">購物車列表</a>
        </li>
    </ul>
    <div class="tab-content" id="myTabContent">
        <!-- tab-pane: Tab1 -->
        <div class="tab-pane fade show active show_div" id="Tab1" role="tabpanel" aria-labelledby="Tab1-tab">
            <el-row>
                <el-col :span="6" v-for="o in productList" :key="o.id" :class="elColClass(!(o.Qty > 0))">
                    <el-card :body-style="{ padding: '0px' }" shadow="always">
                        <div slot="header" style="font-size=.875rem; font-weight:bold;">
                            <span>{{ o.name }}</span>
                        </div>
                        <img :src="o.imgURL" class="image" style="padding-bottom: 6.5rem;">
                        <div style="min-height: 23rem;">
                            <div class="infoDiv">
                                <ul class="list-unstyled">
                                    <li>
                                        <span class="tagSpan" v-if="o.Qty > 0">{{ '數量 : ' + o.Qty }}</span>
                                        <span class="tagSpan" v-else  style="color: red;">{{ '已售完' }}</span>
                                        <span class="tagSpan">{{ '價格 : ' + PriceFormat(o.price) }}</span>                                
                                    </li>
                                    <li>
                                        <input type="number" class="form-control numIpt"  
                                            min="1" :max="o.Qty"
                                            oninput="validity.valid||(value='');" 
                                            v-model.number="o.defaultNum" />
                                    </li>
                                    <li>
                                        <el-button size="mini" :type="o.Qty === 1 ? 'danger' : 'primary'" icon="el-icon-plus"
                                                @click="addToCart(o)"
                                        >加入購物車</el-button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- tab-pane: Tab2 -->
        <div class="tab-pane fade show_div" id="Tab2" role="tabpanel" aria-labelledby="Tab2-tab">
            <div style="padding-bottom: 2.75rem;">
                <table class="tableDetail" style="font-size: .875rem;">
                    <thead>
                        <tr>
                            <th style="text-align: center;"></th>
                            <th>商品名稱</th>
                            <th>數量</th>
                            <th style="text-align: center;">價格</th>
                            <th style="text-align: center;">總價</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody v-cloak>
                        <tr v-if="cartList.length === 0">
                            <td colspan="5" style="font-weight: bold; text-align: center; ">查無商品</td>
                        </tr>
                        <template v-else>
                            <tr v-for="cart in cartList" :key="'cart_' + cart.id">
                                <td><img :src="cart.imgURL"></td>
                                <td>{{ cart.name }}</td>
                                <td>
                                    <input type="number" class="form-control"
                                        :key="'cartNum_'+cart.id"
                                        min="1" :max="cart.Qty"
                                        oninput="validity.valid||(value=1);"
                                        v-on:input="cartNumChange(cart)"
                                        v-model.number="cart.cartNum" />
                                </td>
                                <td style="text-align: center;">{{ PriceFormat(cart.price) }}</td>
                                <td style="text-align: center;">{{ PriceFormat(cart.cartNum * cart.price) }}</td>
                                <td>
                                    <el-button type="danger" plain icon="el-icon-delete" size="mini" 
                                            @click="delCartItem(cart)"
                                    >删除</el-button>
                                </td>
                            </tr>
                            <tr style="font-weight:bold;">
                                <td colspan="2"></td>
                                <td style="text-align: center;">{{ '總數 : ' + SumNum }}</td>
                                <td colspan="2" style="text-align: center;">{{ '總金額 : ' + PriceFormat(SumPrice) }}</td>
                                <td>
                                    <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                            @click="delAllCart"
                                    >全部刪除</el-button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */  // 禁用ESLint
import { db } from "@/utils/firebase.js";
export default {
  name: "Home",
  data() {
    return {
        productList : [],
        cartList : [],
    };
  },
  components: {
  },
  computed: {
      SumNum: {
          get() {
                let sum = this.cartList.reduce((acc, cv) => {
                    return acc + cv.cartNum;
                }, 0);
                
                return sum;
          }
      },
      SumPrice: {
          get() {
                let sum = this.cartList.reduce((acc, cv) => {
                    return acc + (cv.cartNum * cv.price);
                }, 0);

                return sum;
          }
      },
  },
  async created() {
      await this.getProductList();
  },
  methods: {
    elColClass(isReadonly) {
        return isReadonly ? 'is-readonly' : '';
    },
    async getProductList() {
        $('#Loading_dialog').modal('show');
        await db.collection("products").get()
                .then((collectionSnapShot) => {
                    let data = collectionSnapShot.docs.map((doc) => {
                        const id = doc.id;
                        return { ...doc.data(), id };
                    });

                    this.productList = data;     
                    this.productList.forEach((item) => {
                        item['defaultNum'] = 1;
                    });
                    
                    $('#Loading_dialog').modal('hide');
                })
                .catch((error) => {
                    this.showMsg([error.code])
                    $('#Loading_dialog').modal('hide');
                });
    },
    addToCart(product) {
        let filterRes = this.cartList.filter((item) => { return item.id === product.id });
        if (filterRes.length === 0) {
            this.cartList.push({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'Qty': product.Qty,
                'imgURL': product.imgURL,
                'cartNum': product.defaultNum
            })
        } else {
            filterRes = filterRes[0];
            filterRes.cartNum = filterRes.cartNum + product.defaultNum
        };
        product.Qty = product.Qty - product.defaultNum
        product.defaultNum = 1
        
        this.showMsg(['已新增至購物車'])
    },
    cartNumChange(c) {
        let filterRes = this.productList.filter((item) => { return item.id === c.id });
        filterRes = filterRes[0];
        filterRes.Qty = c.Qty - c.cartNum;
    },
    async delCartItem(c) {
        await this.productList.filter((item) => { 
            if(item.id === c.id) {
                item.Qty = c.Qty;
                item.defaultNum = 1;
            } 
        });
        let delIdx = this.cartList.findIndex(v => v.id === c.id);
        this.cartList.splice(delIdx, delIdx >= 0 ? 1 : 0);
    },
    async delAllCart() {
        await this.cartList.forEach((item) => {
            this.productList.filter((item1) => { 
                if(item1.id === item.id) {
                    item1.Qty = item.Qty;
                    item1.defaultNum = 1;
                } 
            });
        });
        this.cartList = [];
    },
    PriceFormat(money) {
        if (money && money != null) {
            money = String(money);
            var left = money.split('.')[0]
            var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);

            return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('');

        } else {
            return '0';
        }
    },
    showMsg(Msg) {
        let msgHtml = "";
        Msg.forEach((item) => {
            msgHtml += "<p>" + item + "</p>";
        });
        $("#messageDiv").html(msgHtml)
        $('#messageModal').modal('show');
    },
  }
};
</script>

<style>
    /* readonly */
    .is-readonly {
        opacity: .7;
        pointer-events: none;
        cursor: not-allowed;
    }
    /* Tab 設定 */
    .show_div {
        margin-top: 2rem;
    }
    .container ul.nav {
        display: flex;
        justify-content: center;
    }

    .container > ul.nav {
        z-index: 2;
        position: sticky;
        backdrop-filter: blur(4px);
        background-color: #F0F2F5;
    }

    .container .nav-link.active,
    .container .nav-item.show .nav-link {
        background-color: #F0F2F5 !important;
        border-color: #F0F2F5 !important;
    }

    .container ul.nav .nav-item .nav-link {
        padding: 0 3rem .5rem 3rem;
        color: hsla(0, 0%, 20%, 1);
    }

    .container ul.nav .nav-item .nav-link:hover {
        color: hsla(220, 85%, 60%, 1);
        border: 0;
    }

    .container .nav-link:not(:disabled):not(.disabled).active,
    .container .nav-link:not(:disabled):not(.disabled):active,
    .container .show > .nav-link.dropdown-toggle {
        color: hsla(220, 85%, 60%, 1);
        box-shadow: inset 0 -4px 0 0 hsla(220, 85%, 60%, 1);
    }
    /* card 設定 */
    .el-row {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 1;
        justify-content: flex-start;
        align-items: flex-start;
        min-height: auto !important;
        padding: 0 2rem 90px 2rem;
        margin: 0 -1rem 0 0;
    }
    .el-card {
        flex-basis: calc(100% / 6 - 1rem);
        position: relative;
        min-width: 0;
        margin-right: 1rem;
        margin-top: 1rem;
        margin-bottom: 0;
        border-radius: 10px !important;
        background-color: #fff;
        box-shadow: 0 0 .5rem #ddd;
        overflow: hidden;
        transition: .3s;
    }
    @media (max-width: 1440px) {
        .el-card {
            flex-basis: calc(100% / 5 - 1rem);
        }
    }
    .el-card__body {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        height: 100%;
        transition: .3s;
    }
    .el-card__body img {
        position: absolute;
        min-width: 0%;
        min-height: 0%;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: cover;
        transition: .3s;
    }

    .infoDiv ul {
        position: relative;
        top: 15.5rem;
        /* right: 3.5rem; */
    }
    .infoDiv ul li .tagSpan {
        margin: 1.5rem;
        font-size: .85rem;
        font-weight: 500;

    }

    .infoDiv ul li .numIpt {
        width: 10rem !important;
        line-height: 34px !important;
        font-size: 14px !important;
        /* margin-right: .5rem; */
        margin-left: 2rem;
        margin-top: .5rem;
    }
    .infoDiv ul li .el-button {
        width: 10rem !important;
        margin-left: 2rem;
        margin-top: .5rem;
    }

    .tableDetail, .tableOther {
        white-space: nowrap;
        width: 100%;
    }
    /* img */
    .table tbody td:first-child,
    .tableDetail tbody td:first-child {
        /* width: 80px;
        vertical-align: middle; */
        text-align: center;
    }
    .table tbody td img,
    .tableDetail tbody td img {
        max-width: 64px;
        max-height: 64px;
    }
</style>