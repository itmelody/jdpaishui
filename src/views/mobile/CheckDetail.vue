<template>
  <div class="check-detail">
    <div class="mobile-container">
      <!-- 顶部导航栏 -->
      <div class="top-header">
        <div class="header-back" @click="goBack">
          <LeftOutlined />
        </div>
        <div class="header-title">排口检查</div>
        <div class="header-send" @click="handleSubmit">
          <SendOutlined />
        </div>
      </div>

      <!-- 表单内容 -->
      <div class="form-content">
        <!-- 要素编码 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #faad14;">📋</span>
            <span>要素编码</span>
          </div>
          <div class="item-value editable">
            <input 
              v-model="formData.elementCode" 
              type="text" 
              placeholder="请输入要素编码"
              class="input-field"
            />
            <EditOutlined class="edit-icon" />
          </div>
        </div>

        <!-- 所属片区 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #722ed1;">📍</span>
            <span>所属片区</span>
          </div>
          <div class="item-value clickable" @click="selectDistrict">
            <span>{{ formData.district || '请选择所属片区' }}</span>
            <RightOutlined />
          </div>
        </div>

        <!-- 检查单位 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #1890ff;">🏢</span>
            <span>检查单位</span>
          </div>
          <div class="item-value clickable" @click="selectUnit">
            <span>{{ formData.unit || '请选择检查单位' }}</span>
            <RightOutlined />
          </div>
        </div>

        <!-- 所在河道 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #13c2c2;">🌊</span>
            <span>所在河道</span>
          </div>
          <div class="item-value editable">
            <input 
              v-model="formData.river" 
              type="text" 
              placeholder="请输入所在河道"
              class="input-field"
            />
            <EditOutlined class="edit-icon" />
          </div>
        </div>

        <!-- 管径 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #52c41a;"></span>
            <span>管径</span>
          </div>
          <div class="item-value editable">
            <input 
              v-model="formData.pipeDiameter" 
              type="text" 
              placeholder="请输入管径"
              class="input-field"
            />
            <EditOutlined class="edit-icon" />
          </div>
        </div>

        <!-- 管材 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #eb2f96;">🔧</span>
            <span>管材</span>
          </div>
          <div class="item-value editable">
            <input 
              v-model="formData.pipeMaterial" 
              type="text" 
              placeholder="请输入管材"
              class="input-field"
            />
            <EditOutlined class="edit-icon" />
          </div>
        </div>

        <!-- 是否旱流 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #722ed1;">💧</span>
            <span>是否旱流</span>
          </div>
          <div class="item-value radio-group">
            <button 
              class="radio-btn" 
              :class="{ active: formData.isDryFlow === '是' }"
              @click="formData.isDryFlow = '是'"
            >
              是
            </button>
            <button 
              class="radio-btn" 
              :class="{ active: formData.isDryFlow === '否' }"
              @click="formData.isDryFlow = '否'"
            >
              否
            </button>
          </div>
        </div>

        <!-- 是否畅通 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #722ed1;">✅</span>
            <span>是否畅通</span>
          </div>
          <div class="item-value radio-group">
            <button 
              class="radio-btn" 
              :class="{ active: formData.isUnblocked === '是' }"
              @click="formData.isUnblocked = '是'"
            >
              是
            </button>
            <button 
              class="radio-btn" 
              :class="{ active: formData.isUnblocked === '否' }"
              @click="formData.isUnblocked = '否'"
            >
              否
            </button>
          </div>
        </div>

        <!-- 排口类型 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #52c41a;">🔩</span>
            <span>排口类型</span>
          </div>
          <div class="item-value checkbox-group">
            <button 
              v-for="type in outletTypes" 
              :key="type"
              class="checkbox-btn"
              :class="{ active: selectedOutletTypes.includes(type) }"
              @click="toggleOutletType(type)"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <!-- 排口管底标高 -->
        <div class="form-item">
          <div class="item-label">
            <span class="label-icon" style="background: #fa8c16;">📏</span>
            <span>排口管底标高</span>
          </div>
          <div class="item-value editable">
            <input 
              v-model="formData.bottomElevation" 
              type="text" 
              placeholder="请输入排口管底标高"
              class="input-field"
            />
            <EditOutlined class="edit-icon" />
          </div>
        </div>

        <!-- 现场照片 -->
        <div class="form-item photo-section">
          <div class="item-label">
            <span class="label-icon" style="background: #13c2c2;">📷</span>
            <span>现场照片</span>
          </div>
          <div class="photo-upload">
            <div class="photo-placeholder" @click="uploadPhoto">
              <CameraOutlined style="font-size: 48px; color: #999;" />
            </div>
            <div v-if="photos.length > 0" class="photo-preview">
              <img 
                v-for="(photo, index) in photos" 
                :key="index"
                :src="photo" 
                alt="现场照片"
                class="preview-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  LeftOutlined,
  SendOutlined,
  EditOutlined,
  RightOutlined,
  CameraOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 表单数据
const formData = ref({
  elementCode: '',
  district: '',
  unit: '',
  river: '',
  pipeDiameter: '',
  pipeMaterial: '',
  isDryFlow: '',
  isUnblocked: '',
  bottomElevation: ''
})

// 排口类型选项
const outletTypes = ['有末端截污设施', '有闸门', '管道直排', '八字口', '其它']
const selectedOutletTypes = ref<string[]>([])

// 照片列表
const photos = ref<string[]>([])

// 返回上一页
const goBack = () => {
  router.back()
}

// 提交表单
const handleSubmit = () => {
  console.log('提交表单:', formData.value)
  console.log('选中的排口类型:', selectedOutletTypes.value)
  console.log('照片数量:', photos.value.length)
  
  // TODO: 实现实际的提交逻辑
  alert('提交成功！')
}

// 选择片区
const selectDistrict = () => {
  console.log('选择片区')
  // TODO: 打开片区选择器
  alert('片区选择功能开发中...')
}

// 选择单位
const selectUnit = () => {
  console.log('选择单位')
  // TODO: 打开单位选择器
  alert('单位选择功能开发中...')
}

// 切换排口类型
const toggleOutletType = (type: string) => {
  const index = selectedOutletTypes.value.indexOf(type)
  if (index > -1) {
    selectedOutletTypes.value.splice(index, 1)
  } else {
    selectedOutletTypes.value.push(type)
  }
}

// 上传照片
const uploadPhoto = () => {
  console.log('上传照片')
  // TODO: 实现照片上传功能
  alert('照片上传功能开发中...')
}

onMounted(() => {
  // 从路由参数获取数据
  if (route.query.code) {
    formData.value.elementCode = route.query.code as string
  }
  if (route.query.river) {
    formData.value.river = route.query.river as string
  }
})
</script>

<style scoped lang="scss">
.check-detail {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;

  .mobile-container {
    width: 100%;
    max-width: 480px;
    min-height: 100vh;
    background: #fff;
    position: relative;

    // 顶部导航栏
    .top-header {
      height: 56px;
      background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      color: #fff;
      position: sticky;
      top: 0;
      z-index: 100;

      .header-back {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: background 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        :deep(.anticon) {
          font-size: 20px;
        }
      }

      .header-title {
        font-size: 18px;
        font-weight: 600;
        flex: 1;
        text-align: center;
      }

      .header-send {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: background 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        :deep(.anticon) {
          font-size: 20px;
        }
      }
    }

    // 表单内容
    .form-content {
      padding-bottom: 20px;

      .form-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .item-label {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;

          .label-icon {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
          }

          span:last-child {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
        }

        .item-value {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;

          &.editable {
            .input-field {
              flex: 1;
              border: none;
              outline: none;
              padding: 8px 0;
              font-size: 14px;
              color: #333;
              text-align: right;

              &::placeholder {
                color: #999;
              }
            }

            .edit-icon {
              color: #999;
              font-size: 16px;
              margin-left: 8px;
            }
          }

          &.clickable {
            cursor: pointer;
            color: #999;
            font-size: 14px;

            :deep(.anticon) {
              color: #999;
              font-size: 14px;
            }
          }

          &.radio-group {
            display: flex;
            gap: 12px;

            .radio-btn {
              flex: 1;
              padding: 8px 16px;
              background: #f5f7fa;
              border: 2px solid transparent;
              border-radius: 8px;
              font-size: 14px;
              color: #666;
              cursor: pointer;
              transition: all 0.3s;

              &.active {
                background: #e6f7ff;
                border-color: #1890ff;
                color: #1890ff;
                font-weight: 600;
              }

              &:hover:not(.active) {
                background: #e8e8e8;
              }
            }
          }

          &.checkbox-group {
            flex-wrap: wrap;
            gap: 8px;
            justify-content: flex-start;

            .checkbox-btn {
              padding: 8px 16px;
              background: #f5f7fa;
              border: 2px solid transparent;
              border-radius: 8px;
              font-size: 14px;
              color: #666;
              cursor: pointer;
              transition: all 0.3s;

              &.active {
                background: #e6f7ff;
                border-color: #1890ff;
                color: #1890ff;
                font-weight: 600;
              }

              &:hover:not(.active) {
                background: #e8e8e8;
              }
            }
          }
        }

        &.photo-section {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;

          .photo-upload {
            width: 100%;

            .photo-placeholder {
              width: 120px;
              height: 120px;
              background: #f5f7fa;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background 0.3s;

              &:hover {
                background: #e8e8e8;
              }
            }

            .photo-preview {
              display: flex;
              gap: 8px;
              margin-top: 12px;
              flex-wrap: wrap;

              .preview-img {
                width: 120px;
                height: 120px;
                object-fit: cover;
                border-radius: 8px;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .check-detail {
    .mobile-container {
      box-shadow: none;
    }
  }
}
</style>
