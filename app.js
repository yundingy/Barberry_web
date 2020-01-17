const app = new Framework7({
    root: '#app',
    name: 'My App',
    id: 'com.myapp.test',
    panel: {
        swipe: 'left',
    },
    dialog: {
        buttonOk: '确定',
        buttonCancel: '取消'
    },
    routes: routes,
    methods: {
        toast(message, status) {
            if (status === true) {
                app.toast.create({
                    icon: '<i class="fa fa-5x fa-check"></i>',
                    text: message,
                    position: 'center',
                    closeTimeout: 2000,
                }).open();
            } else if (status === false) {
                app.toast.create({
                    icon: '<i class="fa fa-5x fa-close"></i>',
                    text: message,
                    position: 'center',
                    closeTimeout: 2000,
                }).open();
            } else {
                app.toast.create({
                    text: message,
                    position: 'center',
                    closeTimeout: 2000,
                }).open();
            }
        },
        alert(status, message) {

        },
        goBack() {
            if (this.views.current.router.history.length == 2) {
                app.dialog.confirm('','退出程序吗？',()=>{
                    plus.webview.currentWebview().close()
                })
            }else{
                this.views.current.router.back();
            }
        }
    },
    on: {
        init: function (e) {
            this.views.create('.view-main');
            if (!localStorage.getItem('role')) {
                this.views.main.router.navigate('/login');
            } else {
                this.views.main.router.navigate('/index');
            }

            if (window.plus) {
                plusReady();
            } else {
                document.addEventListener("plusready", plusReady, false);
            }
        },
        pageInit: function (page) {

        }
    }
});

function plusReady() {
    plus.key.addEventListener('backbutton', function () {
        app.methods.goBack()
    });
}

const ajax = axios.create({
    baseURL: 'http://47.240.38.193:32616/api',
    //baseURL: 'http://127.0.0.1:32616/api',
    timeout: 10000,
    headers: {'role': localStorage.getItem('role')}
});

ajax.interceptors.response.use(function (response) {
    if (response.status !== 200) {
        app.toast.create({
            text: '请求失败',
            position: 'center',
            closeTimeout: 2000,
        }).open();
        return Promise.reject('请求失败');
    }
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}
