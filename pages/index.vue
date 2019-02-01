<template>
  <section class="container">
    <div class="row">
      <h1 class="title col-md-12"> messaging stuff</h1>
    </div>
    <div v-if="!submitted">
      <form @submit.prevent="saveName">
        <input type="text" class="form-control" v-model="name" placeholder="Your name">
        <button type="submit" class="btn btn-dark">Save</button>
      </form>
    </div>

    <div id="container" v-if="submitted" class="full-screen">
      <p>Hi, {{ name }}! Start chatting</p>

      <div class=" " v-for="message in messages">
        <div class="row">
          <div class="col-md-6" v-if="message.username == name">

          </div>
          <div class="card col-md-6">
            <div class="card-body">
              {{ message.message }} <br>
              from <strong>{{ message.username }}</strong>
              on <strong>{{  formatDate(new Date(message.send_at)) }}</strong>
            </div>
          </div>
        </div>
      </div>

      <div class="message-field">
        <form @submit.prevent="addMessage" class="container">
          <input type="text" class="form-control" v-model="message" placeholder="Your message">
          <button type="submit" class="btn btn-dark">Send</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import axios from 'axios'

export default {
  data() {
    return {
      name: '',
      message: '',
      submitted: false,
      messages: [],
      socketsAllow: true
    }
  },

  sockets: {
      connect: function () {
          console.log('socket connected')
      },
      newMessage: function (data) {
        if(this.socketsAllow){
          this.messages.push(data);
          let that = this;
          setTimeout(function() {
            that.scrollToBottom()
          }, 500)
        }
      }
  },
  created(){

  },
  methods:{
    scrollToBottom(){
      window.scrollTo(0,document.querySelector("#container").scrollHeight);
    },
    saveName(){
      if(this.name.trim()){
        this.submitted = true;
        this.getMessages();

        if(!this.socketsAllow){
          let that = this;
          setInterval(function() {
            that.getMessages();
          }, 5000);
        }

      }else{
        alert('enter a name first');
      }

    },
    getMessages(){
      axios.get('/messages').then(r => {
        this.messages = r.data
        let that = this;
        setTimeout(function() {
          that.scrollToBottom()
        }, 500)

      });
    },
    addMessage(){
      axios.post('/message', { username: this.name, message: this.message }).then(r => {
        this.message = ''
        this.scrollToBottom()
      });
    },
    formatDate(date) {
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      var hour = date.getHours();
      var min = date.getMinutes();

      return day + ' ' + monthNames[monthIndex] + ' ' + year  + ' ' + hour + ':' + min;
    }
  }

}
</script>

<style>
  .btn-dark{
    margin-top: 15px;
  }
  .floated{
    float: right;
  }
  .message-field{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0 -5px 10px 0 rgba(0,64,128,.05);
    padding: 15px 0;
  }
  .full-screen{
    float: left;
    width: 100%;
    min-height: calc(100vh - 158px);
    position: relative;
    padding-bottom: 131px;
  }
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
body .card-body{
  padding: 5px;
}
body .card{
  margin: 5px 0;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
