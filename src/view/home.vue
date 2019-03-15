<template>
    <div>
        <ul>
            <li v-for="item in list">
                <br><br>
                <router-link :to="item.path">{{item.title}}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'dapp-home',
    data() {
        return {
            list: [{
                    path: '/random',
                    title: '随机数'
                },
                {
                    path: '/lottery',
                    title: '买彩票'
                },
            ]
        }
    },
}

</script>
