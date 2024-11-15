<template>
  <div class="columns">
    <div class="column is-full">
      <el-card
          class="box-card"
          shadow="never"
      >
        <div
            slot="header"
            class="clearfix"
        >
          <span><i class="fa fa fa-book"> 主题 / 发布主题</i></span>
        </div>
        <div>
          <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
              class="demo-ruleForm"
          >
            <el-form-item prop="title">
              <el-input
                  v-model="ruleForm.title"
                  placeholder="输入主题名称"
              />
            </el-form-item>

            <!--Markdown-->
            <div id="vditor"/>

            <b-taginput
                v-model="ruleForm.tags"
                class="my-3"
                maxlength="15"
                maxtags="3"
                ellipsis
                placeholder="请输入主题标签，限制为 15 个字符和 3 个标签"
            />

            <el-form-item>
              <el-button
                  type="primary"
                  @click="submitForm('ruleForm')"
              >立即创建
              </el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {post} from '@/api/post'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

export default {
  name: 'TopicPost',

  data() {
    return {
      contentEditor: {},
      ruleForm: {
        title: '', // 标题
        tags: [], // 标签
        content: '' // 内容
      },
      rules: {
        title: [
          {required: true, message: '请输入话题名称', trigger: 'blur'},
          {
            min: 1,
            max: 25,
            message: '长度在 1 到 25 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.contentEditor = new Vditor('vditor', {
      height: 500,
      placeholder: '此处为话题内容……',
      theme: 'classic',
      counter: {
        enable: true,
        type: 'markdown'
      },
      preview: {
        delay: 0,
        hljs: {
          style: 'monokai',
          lineNumber: true
        }
      },
      tab: '\t',
      typewriterMode: true,
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      mode: 'sv',
      upload: {
        accept: 'image/jpg,image/jpeg,image/png,image/bmp,image/gif,' +
            'video/mp4,video/avi,video/mov,' +
            'audio/mp3,audio/wav,audio/flac,' +
            'application/zip,application/x-rar-compressed,application/x-7z-compressed',
        url: 'http://127.0.0.1:8081/file/upload',
        // 30m
        max: 1024 * 1024 * 30,
        linkToImgUrl: '',
        fieldName: 'file',
        multiple: false,
        format: (file, response) => {
          const res = JSON.parse(response);
          if (res.code === 200) {
            this.insertFile(res.data)
          } else {
            throw new Error(res.message);
          }
        },
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters.token // 如果需要认证
        },
        withCredentials: true, // 如果需要携带 cookies
        timeout: 60000 // 超时时间，单位毫秒
      }
    })
  },
  methods: {
    insertFile(url) {
      // 根据文件类型插入不同的 Markdown 格式
      if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || url.endsWith('.bmp')) {
        const imageMarkdown = `![](${url})`;
        console.log('insert image')
        this.contentEditor.insertMD(imageMarkdown);
      } else if (url.endsWith('.mp4') || url.endsWith('.avi') || url.endsWith('.mov')) {
        const videoMarkdown = `<video src="${url}" controls></video>`;
        console.log('insert video')
        this.contentEditor.insertMD(videoMarkdown);
      } else if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.flac')) {
        const audioMarkdown = `<audio src="${url}" controls></audio>`;
        console.log('insert audio')
        this.contentEditor.insertMD(audioMarkdown);
      } else if (url.endsWith('.zip') || url.endsWith('.rar') || url.endsWith('.7z')) {
        const fileMarkdown = `[下载文件](${url})`;
        console.log('insert file')
        this.contentEditor.insertMD(fileMarkdown);
      } else {
        console.warn('未知文件类型:', url);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
              this.contentEditor.getValue().length === 1 ||
              this.contentEditor.getValue() == null ||
              this.contentEditor.getValue() === ''
          ) {
            alert('话题内容不可为空')
            return false
          }
          if (this.ruleForm.tags == null || this.ruleForm.tags.length === 0) {
            alert('标签不可以为空')
            return false
          }
          this.ruleForm.content = this.contentEditor.getValue()
          post(this.ruleForm).then((response) => {
            const {data} = response
            setTimeout(() => {
              this.$router.push({
                name: 'post-detail',
                params: {id: data.id}
              }).catch(error => {
                console.log(error)
              })
            }, 800)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.contentEditor.setValue('')
      this.ruleForm.tags = ''
    }
  }
}
</script>

<style>
</style>