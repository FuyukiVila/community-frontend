<template>
  <section>
    <div class="columns">
      <div class="column is-full">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span><i class="fa fa fa-book"> 主题 / 更新主题</i></span>
          </div>
          <div>
            <el-form ref="topic" :model="topic" class="demo-topic">
              <el-form-item prop="title">
                <el-input
                    v-model="topic.title"
                    placeholder="输入新的主题名称"
                ></el-input>
              </el-form-item>

              <!--Markdown-->
              <div id="vditor"></div>

              <b-taginput
                  v-model="tags"
                  class="my-3"
                  ellipsis
                  maxlength="15"
                  maxtags="3"
                  placeholder="请输入主题标签，限制为 15 个字符和 3 个标签"
              />
              <el-form-item class="mt-3">
                <el-button type="primary" @click="handleUpdate()"
                >更新
                </el-button>
                <el-button @click="resetForm('topic')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script>
import {getTopic, update} from "@/api/post";
import Vditor from "vditor";
import "vditor/dist/index.css";

export default {
  name: "TopicEdit",
  components: {},
  data() {
    return {
      topic: {},
      tags: [],
    };
  },
  created() {
    this.fetchTopic();
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
    renderMarkdown(md) {
      this.contentEditor = new Vditor("vditor", {
        height: 500,
        placeholder: '输入要更新的内容',
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
        },
        after: () => {
          this.contentEditor.setValue(md);
        },
      });
    },
    fetchTopic() {
      getTopic(this.$route.params.id).then((value) => {
        this.topic = value.data.topic;
        this.tags = value.data.tags.map(tag => tag.name);
        this.renderMarkdown(this.topic.content);
      }).catch(error => {
        console.log(error);
      });
    },
    handleUpdate: function () {
      this.topic.content = this.contentEditor.getValue();
      update(this.topic).then((response) => {
        const {data} = response;
        console.log(data);
        setTimeout(() => {
          this.$router.replace({
            name: "post-detail",
            params: {id: data.id},
          }).catch(error => {
            console.log(error)
          });
        }, 800);
      }).catch(error => {
        console.log(error);
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.contentEditor.setValue("");
      this.tags = "";
    },
  },
};
</script>

<style>
.vditor-reset pre > code {
  font-size: 100%;
}
</style>