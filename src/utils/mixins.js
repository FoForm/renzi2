import store from '@/store/index'
export const mixins = {
    // created () {
    //     console.log('mixins>created');
    // },
    // mounted () {
    //     console.log('我是mixins里面的mounted');
    // },
    methods: {
        checkPermission(key){
            return !store.state.user.userInfo.roles.points.includes(key)
        }
    }
}