
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
          <div class="col-2">
            <input
              type="text"
              class="form-control"
              placeholder="Abreviação"
              aria-describedby="basic-addon1"
              v-model="abreviacao_upd"
              id="abreviacao_upd"
            />
          </div>
          <b-button class="m-3" variant="outline-primary" block @click="update">Salvar</b-button>
        </div>
      </b-modal>
    </div>
    <div class="card-body">
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
        <div class="col-2">
          <input
            type="text"
            class="form-control"
            placeholder="Abreviação"
            aria-describedby="basic-addon1"
            v-model="abreviacao"
            id="abreviacao"
          />
        </div>
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
        <div class="col-3" v-for="(estado,index) in listOrder" v-bind:key="estado._id">
          <div class="card mb-2">
            {{estado.nome + "-" + estado.abreviacao}}
            <div class="row">
              <div class="col">
                <router-link
                  :to="{ name: 'Cidade', params: { _id: estado._id }}"
                  title="Cadastrar cidades"
                >
                  <i class="fas fa-city"></i>
                </router-link>
              </div>
              <div class="col">
                <a
                  href="#"
                  v-on:click="openModalUpdate(index)"
                  id="'update' + index"
                  title="Alterar"
                  v-b-modal.modal_upd
                >
                  <i class="fas fa-edit"></i>
                </a>
              </div>
              <div class="col">
                <a href="#" v-on:click="remove(index)" id="'remover' + index" title="Excluir">
                  <i class="fas fa-trash-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const api = 'https://hugoapp-server.herokuapp.com/'
export default {
  name: "Estado",
  data() {
    return {
      estados: [],
      nome: "",
      abreviacao: "",
      nome_upd: "",
      abreviacao_upd: "",
      estado_upd: "",
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
      var lista = self.estados.filter(function(estado) {
        return (
          estado.nome.toLowerCase().indexOf(self.filtro.toLowerCase()) !== -1
        );
      });
      return _.orderBy(lista, "nome", this.order_by);
    }
  },
  methods: {
    listarTodos: function() {
      axios.get("https://hugoapp-server.herokuapp.com/estados").then(response => (this.estados = response.data));
    },
    create: function() {
      if (this.nome.trim() == "") {
        alert("Nome não pode ser vazio.");
        return;
      }
      if (this.abreviacao.trim() == "") {
        alert("Abreviação não pode ser vazia.");
        return;
      }
      var estado = {
        nome: this.nome,
        abreviacao: this.abreviacao
      };
      axios
        .post("/estados", estado)
        .then(response => this.estados.push(response.data));
    },
    update: function(index) {
      var estado = this.estado_upd;
      estado.nome = this.nome_upd;
      estado.abreviacao = this.abreviacao_upd;
      var obj;
      axios
        .put("/estados/" + estado._id, estado)
        .then(response => (obj = response.data));
      this.hideModal();
    },
    remove: function(index) {
      if (!confirm("Deseja excluir?")) return;
      var estado = this.estados[index];
      this.estados.splice(index, 1);
      axios
        .delete("/estados/" + estado._id)
        .then(response => (estado = response.data));
      console.log(estado);
    },
    openModalUpdate: function(index) {
      var estado = this.estados[index];
      this.estado_upd = estado;
      this.nome_upd = estado.nome;
      this.abreviacao_upd = estado.abreviacao;
    },
    hideModal() {
      this.$refs["modal_upd"].hide();
    }
  }
};
</script>
<style>
body {
  background-color: #e6e6e6;
}
a {
  color: #a8a8a8;
}
</style>