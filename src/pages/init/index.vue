<template>
    <div class="container">
        <!-- Header (图片位置保留) -->
        <img class="header-image" alt="header" />

        <div class="content">
            <!-- 导航路径 -->
            <div class="nav-path">
                <span>仓库</span>
                <span class="separator">/</span>
                <span class="current">入库</span>
            </div>

            <!-- 表单区域 -->
            <div class="form-section">
                <!-- 币种选择 -->
                <div class="form-group">
                    <h3>币种 (1)</h3>
                    <div class="button-group">
                        <button v-for="(currency, index) in currencies" :key="index" class="currency-btn">
                            {{ currency }}
                        </button>
                    </div>
                </div>

                <!-- 筹码类型 -->
                <div class="form-group">
                    <h3>筹码类型 (2)</h3>
                    <div class="button-group">
                        <button v-for="(chip, index) in chipTypes" :key="index" class="chip-btn">
                            {{ chip }}
                        </button>
                    </div>
                </div>

                <!-- 面数选择 -->
                <div class="form-group">
                    <h3>面数选择 (3) 请选择购票日期</h3>
                    <div class="grid-container">
                        <div v-for="(value, index) in faceValues" :key="index" class="grid-item">
                            {{ value }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
                <button class="cancel-btn">取消</button>
                <button class="next-btn">下一步</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const currencies = ref(['FMB', 'TWD']);
const chipTypes = ref(['FMB', 'RMB', 'TWD']);
const faceValues = ref([
    0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5,
    0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6
]);
</script>

<style lang="scss" scoped>
.container {
    max-width: 1920px;
    min-height: 1080px;
    margin: 0 auto;
    padding: 20px;
    background: #f5f6fa;

    .header-image {
        width: 100%;
        height: 80px;
        background: #ddd;
        margin-bottom: 30px;
    }

    .nav-path {
        font-size: 16px;
        color: #666;
        margin-bottom: 30px;

        .separator {
            margin: 0 8px;
        }

        .current {
            color: #2d8cf0;
        }
    }

    .form-section {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

        .form-group {
            margin-bottom: 40px;

            h3 {
                color: #333;
                margin-bottom: 20px;
                font-size: 18px;
            }
        }
    }

    .button-group {
        display: flex;
        gap: 15px;

        button {
            padding: 10px 25px;
            border: 1px solid #dcdee2;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
                border-color: #2d8cf0;
                color: #2d8cf0;
            }
        }
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 15px;

        .grid-item {
            padding: 15px;
            border: 1px solid #eee;
            text-align: center;
            border-radius: 4px;
            background: #f8f9fa;
        }
    }

    .action-buttons {
        margin-top: 40px;
        display: flex;
        justify-content: flex-end;
        gap: 20px;

        button {
            padding: 12px 35px;
            border-radius: 4px;
            cursor: pointer;

            &.cancel-btn {
                background: white;
                border: 1px solid #dcdee2;
            }

            &.next-btn {
                background: #2d8cf0;
                color: white;
                border: none;
            }
        }
    }
}

@media (max-width: 768px) {
    .container {
        padding: 10px;

        .button-group {
            flex-wrap: wrap;
        }

        .grid-container {
            grid-template-columns: repeat(3, 1fr);
        }

        .action-buttons {
            flex-direction: column;

            button {
                width: 100%;
            }
        }
    }
}
</style>