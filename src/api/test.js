import request from "@/utils/request"

// request.get("/db.json").then(res => {
//     console.log(res.data);
    
// })

const BASE_URI = process.env.VUE_APP_BASE_API

request({
    method: "get",
    // url: BASE_URI + "/db.json"
    url: "/db.json"
}).then(res => {
    console.log("get2" + res.data);
    
})

export default {
    getList() {
        const req = request({
            method: "get",
            // url: BASE_URI + "/db.json"
            url: "/db.json"
        })
        return req;
    }
}