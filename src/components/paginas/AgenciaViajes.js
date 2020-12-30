import React, { Component } from "react";
import FormAgenciasViajes from "./comguiasturisticos/FormAgenciasViajes";
import Msg from "../utiles/Msg";

class agenciaviajes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      novedad: {
        idlocalidad: 6, //Ciudad de San Luis por defecto
        legajo: "",
        registro: "",
        nombre: "",
        domicilio:"",
        telefono: "",
        mail:"",
        web:"",
        representante: "",
        adhiereDosep:""
      },
      novedades: [],
      localidades: [],
      msg: {
        visible: false,
        body: ""
      }
    };
    this.getData = this.getData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleFromNovSubmit = this.handleFromNovSubmit.bind(this);
    this.eliminarNovedad = this.eliminarNovedad.bind(this);
    this.handleLocalidadChange = this.handleLocalidadChange.bind(this);
  }

  handleLocalidadChange(event) {
    this.setState({
      novedad: {
        ...this.state.novedad,
        idlocalidad: event.target.value
      }
    });
  }

  eliminarNovedad(id) {
    this.setState(
      {
        loading: true
      },
      () => {
        fetch(`${process.env.REACT_APP_API_HOST}/guiasturismo/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: ""
          }
        })
          .then(res => res.json())
          .then(
            result => {
              if (!result.err) {
                this.setState(
                  {
                    msg: {
                      visible: true,
                      body: "El guía se elimino correctamente."
                    }
                  },
                  () => {
                    this.getData();
                  }
                );
              } else {
                this.setState({
                  msg: {
                    visible: true,
                    body: result.errMsgs
                  }
                });
              }
            },
            error => {
              //???
              console.log(error);
            }
          );
      }
    );
  }

  handleFromNovSubmit(event) {
    event.preventDefault();
    const data = new FormData();
    data.append("idlocalidad", this.state.novedad.idlocalidad);
    //Falta validar la fecha!
    data.append("legajo", this.state.novedad.legajo);
    data.append("registro", this.state.novedad.registro);
    data.append("nombre", this.state.novedad.nombre);
    data.append("domicilio", this.state.novedad.domicilio);
    data.append("telefono", this.state.novedad.telefono);
    data.append("mail", this.state.novedad.mail);
    data.append("web", this.state.novedad.web);
    data.append("representante", this.state.novedad.representante);
    data.append("adhiereDosep", this.state.novedad.adhiereDosep);

    console.log(data);
    fetch(`${process.env.REACT_APP_API_HOST}/addagenciadeviajes`, {
      method: "POST",
      headers: {
        Authorization: ""
      },
      body: data
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            this.setState(
              {
                msg: {
                  visible: true,
                  body: "Los datos se agregaron correctamente"
                }
              },
              () => {
                this.resetForm();
                this.getData();
              }
            );
          } else {
            this.setState({
              msg: {
                visible: true,
                body: result.errMsgs
              }
            });
          }
        },
        error => {
          //???
          console.log(error);
        }
      );
  }

  resetForm() {
    let date = new Date().toISOString().substr(0, 10);
    this.setState({
      novedad: {
        idlocalidad: 6, //Ciudad de San Luis por defecto
        legajo: "",
        registro: "",
        nombre: "",
        domicilio:"",
        telefono: "",
        mail:"",
        web:"",
        representante: "",
        adhiereDosep:""
      }
    });
    document.getElementById("frm-novedades").reset();
  }

  handleInputChange(event) {
      console.log(event.target.value)
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      novedad: {
        ...this.state.novedad,
        [name]: value
      }
    });
  }

  handleImgChange(event) {
    let id = "img-" + event.target.id;
    var reader = new FileReader();
    reader.onload = function(e) {
      let imagen = document.getElementById(id);
      imagen.setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getData() {
    fetch(`${process.env.REACT_APP_API_HOST}/agencias/viaje`, {
      method: "GET",
      headers: {
        Authorization: ""
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (!result.err) {
            this.setState({
              novedades: result.data.registros
            });
          } else {
            this.setState({
              msg: {
                visible: true,
                body: result.errMsg
              }
            });
          }
        },
        error => {
          //???
          console.log(error);
        }
      );
    this.setState({
      loading: false
    });
    //Localidades
    let ciudades = new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_HOST}/ciudades`, {
        method: "GET",
        headers: {
          Authorization: ""
        }
      })
        .then(res => res.json())
        .then(
          result => {
            if (!result.err) {       
                   console.log(result.data.registros);

              this.setState(
                {
                  localidades: result.data.registros
                },
                () => {
                  resolve("Ok Ciudades");
                }
              );
            } else {
              this.setState(
                {
                  msg: {
                    visible: true,
                    body: result.errMsg
                  }
                },
                () => {
                  reject("Error");
                }
              );
            }
          },
          error => {
            //???
            console.log(error);
            reject("Error");
          }
        );
    });
    Promise.all([ciudades]).then(values => {
      this.setState({
        loading: false
      });
    });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const lista_guias = this.state.novedades.map(novedad => {
      return (
        <FormAgenciasViajes
          key={`novedad-${novedad.id}`}
          id={novedad.id}
          localidades={this.state.localidades}
          eliminar={this.eliminarNovedad}
        />
      );
    });
    const localidades = this.state.localidades.map(localidad => {
        
      return (
        <option key={`loc-${localidad.id}`} value={localidad.id}>
          {localidad.nombre}
        </option>
      );
    });
    return (
      <div className="Novedades">
        {this.state.loading ? (
          <div>Cargando</div>
        ) : (
          <React.Fragment>
            <h4 className="bg-info text-white p-3 mb-3 rounded animated bounceInLeft delay-2s">
              <i className="fas fa-user" /> Nueva Agencia de Viajes 
            </h4>
            <form
              method="post"
              onSubmit={this.handleFromNovSubmit}
              id="frm-novedades"
            >
              <div className="grid-noveades">
                <div className="noveades-span-row-2">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="id">Localidad</label>
                        <select
                          name="idlocalidad"
                          id="idlocalidad"
                          className="form-control"
                          value={this.state.novedad.idlocalidad}
                          onChange={this.handleLocalidadChange}
                        >
                          {localidades}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="legajo">Legajo</label>
                        <input
                          type="text"
                          name="legajo"
                          id="legajo"
                          className="form-control"
                          value={this.state.novedad.legajo}
                          onChange={this.handleInputChange}
                          maxLength="50"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="registro">Registro</label>
                        <input
                          type="text"
                          name="registro"
                          id="registro"
                          className="form-control"
                          value={this.state.novedad.registro}
                          onChange={this.handleInputChange}
                          maxLength="75"
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="nombre">Nombre de Fantasía</label>
                        <input
                          type="text"
                          name="nombre"
                          id="nombre"
                          className="form-control"
                          value={this.state.novedad.nombre}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="domicilio">Domicilio</label>
                        <input
                          type="text"
                          name="domicilio"
                          id="domicilio"
                          className="form-control"
                          value={this.state.novedad.domicilio}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <input
                          type="text"
                          name="telefono"
                          id="telefono"
                          className="form-control"
                          value={this.state.novedad.telefono}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="mail">Correo</label>
                        <input
                          type="text"
                          name="mail"
                          id="mail"
                          className="form-control"
                          value={this.state.novedad.mail}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="web">Web</label>
                      <input
                        type="text"
                        name="web"
                        id="web"
                        className="form-control"
                        value={this.state.novedad.web}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>   
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="representante">Representante</label>
                      <input
                        type="text"
                        name="representante"
                        id="representante"
                        className="form-control"
                        value={this.state.novedad.representante}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>       
                  <div className="col">
                  <div className="form-check">                   
                        <input name="adhiereDosep" id="adhiereDosep" 
                        className="form-check-input" 
                        type="checkbox" 
                        value={this.state.novedad.adhiereDosep} 
                        onChange={this.handleInputChange} />                          
                        <label className="form-check-label" htmlFor="adhiereDosep">
                            Adhiere Dosep?
                        </label>
                      </div>
                  </div>        
                </div>
              
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-warning">
                      <i className="far fa-window-restore" />
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-arrow-down" /> Agregar Guía
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <hr />
            <h5 className="bg-dark text-white p-3 mb-3 rounded">
              Listado de Agencia de Viajes 
            </h5>
            <div className="row">
              <div className="col">
                <hr />
                {lista_guias}
              </div>
            </div>
          </React.Fragment>
        )}
        <Msg
          visible={this.state.msg.visible}
          okClose={() =>
            this.setState({ msg: { ...this.state.msg, visible: false } })
          }
          tipo="0"
        >
          {this.state.msg.body}
        </Msg>
        <style jsx="true">{`
          .grid-noveades {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 10px;
          }
          .noveades-span-row-2 {
            grid-row: span 2 / auto;
          }
        `}</style>
      </div>
    );
  }
}
export default agenciaviajes;
