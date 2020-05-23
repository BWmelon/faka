<template>
    <div class="main">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>
                    <i class="el-icon-bell"></i> 公告信息
                </span>
            </div>
            <ul>
                <li v-for="notice in notices" :key="notice" class="notice">{{ notice }}</li>
            </ul>
        </el-card>
        <div class="flex">
            <router-view class="router-view"></router-view>
            <el-card class="box-card info">
                <div slot="header" class="clearfix">
                    <span>
                        <i class="el-icon-user"></i> 商家信息
                    </span>
                </div>
                <ul class="info-item">
                    <li>
                        <span>商铺名称</span>
                        {{ info.name }}
                    </li>
                    <li>
                        <span>商铺地址</span>
                        {{ info.url }}
                    </li>
                    <li>
                        <span>商家QQ</span>
                        {{ info.qq }}
                        <a
                            target="_blank"
                            :href="'http://wpa.qq.com/msgrd?v=3&uin=' + info.qq +'&site=qq&menu=yes'"
                            style="vertical-align: middle;"
                        >
                            <img
                                border="0"
                                src="http://pub.idqqimg.com/qconn/wpa/button/button_111.gif"
                                alt="点击这里给我发消息"
                                title="点击这里给我发消息"
                            />
                        </a>
                    </li>
                    <li>
                        <span>手机下单</span>
                        <div class="qrcode" ref="qrCodeUrl"></div>
                    </li>
                </ul>
            </el-card>
        </div>
    </div>
</template>

<script>
import noticeApi from "@/api/notice";
import infoApi from "@/api/info";
import QRCode from "qrcodejs2";
export default {
    data() {
        return {
            notices: [],
            info: {
                name: "",
                url: "12345",
                qq: ""
            }
        };
    },
    created() {
        this.getNotice();
        this.getInfo();
    },
    methods: {
        getNotice() {
            noticeApi.getNotices().then(data => {
                const resp = data.data;
                if (resp.flag) {
                    this.notices = resp.data;
                }
            });
        },
        getInfo() {
            infoApi.getInfo().then(data => {
                const resp = data.data;
                if (resp.flag) {
                    this.info.name = resp.data.name;
                    this.info.url = resp.data.url;
                    this.info.qq = resp.data.qq;
                    this.createQrCode();
                }
            });
        },
        createQrCode() {
            let qrcode = new QRCode(this.$refs.qrCodeUrl, {
                text: this.info.url,
                width: 100,
                height: 100,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }
};
</script>

<style scoped>
.main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
ul {
    list-style: none;
}
.notice {
    line-height: 24px;
    font-weight: bold;
}
.notice:nth-child(4n + 1) {
    color: #090;
}
.notice:nth-child(4n + 2) {
    color: #396;
}
.notice:nth-child(4n + 3) {
    color: #337fe5;
}
.notice:nth-child(4n + 4) {
    color: #f00;
}
.notice:nth-child(n + 2) {
    margin-top: 6px;
}

.router-view {
    width: 100%;
}
.info {
    margin-top: 20px;
    height: 100%;
}
.info-item {
    font-size: 14px;
}
.info-item li {
    line-height: 25px;
}
.info-item li:nth-child(n + 2) {
    margin-top: 15px;
}
.info-item span {
    display: inline-block;
    width: 60px;
}
.flex {
    margin-top: 20px;
}

@media screen and (min-width: 992px) {
    .flex {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .router-view {
        width: calc(60% - 10px);
    }
    .info {
        width: calc(40% - 10px);
        margin-top: 0;
    }
}
.qrcode {
    display: inline-block;
    vertical-align: top;
}
.qrcode img {
    width: 132px;
    height: 132px;
    background-color: #fff;
    padding: 6px;
    box-sizing: border-box;
}
</style>
