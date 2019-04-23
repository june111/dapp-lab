<template>
    <div>
        <div class="loading-mask" id="dom">
        </div>
        <div class="loading">
            <!-- <img src="../assets/loading.svg" alt="" class="Rotation"> -->
            <div class="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</template>

<style>
/*
 * loading
 */
.white {
    color: #fff;
}

.loading-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 20000;
    background-color: #000000cc;

    /*display: none;*/
}

.loading {
    z-index: 20001;

    width: 150px;
    height: 15px;
    margin: 0 auto;
    margin-top: 100px;
    text-align: center;

    position: fixed;
    top: 35%;
    left: 37%;

    /*display: none;*/
}

/*图片旋转*/
/*@-webkit-keyframes rotation {
    from {
        -webkit-transform: rotate(0deg);
    }

    to {
        -webkit-transform: rotate(360deg);
    }
}

.Rotation {
    -webkit-transform: rotate(360deg);
    animation: rotation 1.5s linear infinite;
    -moz-animation: rotation 1.5s linear infinite;
    -webkit-animation: rotation 1.5s linear infinite;
    -o-animation: rotation 1.5s linear infinite;
}*/
/*菊花转*/
.lds-spinner {
    color: official;
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
}

.lds-spinner div {
    transform-origin: 32px 32px;
    animation: lds-spinner 1.2s linear infinite;
}

.lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 29px;
    width: 5px;
    height: 14px;
    border-radius: 20%;
    background: #fff;
}

.lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
}

.lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
}

.lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
}

.lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
}

.lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
}

.lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
}

.lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
}

.lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
}

.lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
}

.lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
}

.lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
}

.lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
}

@keyframes lds-spinner {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

</style>
