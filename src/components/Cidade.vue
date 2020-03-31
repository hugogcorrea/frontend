<style>
body {
  background-color: #e6e6e6 !important;
}
a {
  color: #a8a8a8 !important;
}
</style>

<template>
  <div class="container card">
    <div>
      <b-modal ref="modal_upd" id="modal_upd" title="Alterar" hide-footer>
        <div class="row d-flex align-items-center">
          <div class="col-8 m-2">
            <input
              type="text"
              class="form-control"
              placeholder="Nome"
              aria-describedby="basic-addon1"
              v-model="nome_upd"
              id="nome_upd"
            />
          </div>
          <div class="col-1"></div>
          <b-button class="m-3" variant="outline-primary" block @click="update">Salvar</b-button>
        </div>
      </b-modal>
    </div>
    <div class="card-body">
      <div class="row d-flex align-items-center">
        <div class="col text-left">
          <p>Estado: {{estado.nome}}</p>
        </div>
        <div class="col text-right">
          <router-link to="/" title="Home">
            <i class="fas fa-home"></i>
          </router-link>
        </div>
      </div>
      <div class="row d-flex align-items-center mb-3 border">
        <div class="col-4 m-2">
          <input
            type="text"
            class="form-control"
            placeholder="Nome"
            aria-describedby="basic-addon1"
            v-model="nome"
            id="nome"
          />
        </div>
        <div class="col-1"></div>
        <div class="col-1">
          <a href="#" id="create" v-on:click="create">
            <i class="fas fa-plus-circle"></i>
          </a>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <input
            type="text"
            class="form-control"
            placeholder="Pesquisar"
            aria-describedby="basic-addon1"
            v-model="filtro"
            id="filtro"
          />
        </div>
        <div class="col-4"></div>
        <div class="col-2 text-right">
          <label>Ordernar por:</label>
        </div>
        <div class="col-3 text-left">
          <div class="form-group">
            <select class="form-control" v-model="order_by">
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Nome</th>
              <th>#</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cidade,index) in listOrder" v-bind:key="cidade._id">
              <td>{{cidade.nome}}</td>
              <td>
                <a
                  href="#"
                  v-on:click="openModalUpdate(cidade._id)"
                  id="'update' + index"
                  title="Alterar"
                  v-b-modal.modal_upd
                >
                  <i class="fas fa-edit"></i>
                </a>

                <a
                  href="#"
                  v-on:click="remove(index)"
                  id="'remover' + index"
                  title="Excluir"
                  class="p-3"
                >
                  <i class="fas fa-trash-alt"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>       
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Cidade",
  data() {
    return {
      estado: {
        cidades: []
      },
      nome: "",
      abreviacao: "",
      nome_upd: "",
      cidade_upd: "",
      cidade_return: "",
      order_by: "asc",
      filtro: ""
    };
  },
  mounted() {
    this.listarTodos();
  },
  computed: {
    listOrder() {
      var self = this;
      var lista = self.estado.cidades.filter(function(cidade) {
        return (
          cidade.nome.toLowerCase().indexOf(self.filtro.toLowerCase()) !== -1
        );
      });
      return _.orderBy(lista, "nome", this.order_by);
    }
  },
  methods: {
    listarTodos: function() {
      axios
        .get("https://hugoapp-server.herokuapp.com/cidades/" + this.$route.params._id)
        .then(response => (this.estado = response.data));
    },
    create: function() {
      if (this.nome.trim() == "") {
        alert("Nome não pode ser vazio.");
        return;
      }
      var cidade = {
        nome: this.nome,
        estadoId: this.$route.params._id
      };
      axios.post("https://hugoapp-server.herokuapp.com/cidades", cidade).then(response => (cidade = response.data));
     this.estado.cidades.push(cidade)
    },
    update: function(index) {
      var cidade = this.cidade_upd
      cidade.nome = this.nome_upd
      var obj
      axios
        .put("https://hugoapp-server.herokuapp.com/cidades/" + cidade._id, cidade)
        .then(response => (this.cidade_return = response.data))
      this.hideModal()
    },
    remove: function(index) {
      if (!confirm("Deseja excluir?")) return
      var cidade = this.estado.cidades[index]
      this.estado.cidades.splice(index, 1)
      axios
        .delete("https://hugoapp-server.herokuapp.com/cidades/" + cidade._id)
        .then(response => (this.cidade_return = response.data))
    },
    openModalUpdate: function(_id) {
      var cidade = this.estado.cidades.find(function(cidade) {
        return cidade._id == _id
      })
      this.cidade_upd = cidade
      this.nome_upd = cidade.nome
    },
    hideModal() {
      this.$refs["modal_upd"].hide()
    }
  }
}
</script>
