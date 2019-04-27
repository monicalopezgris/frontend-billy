import React, { Component } from "react";
import doc from "./doc-service";
const { Consumer, Provider } = React.createContext();

export { Consumer };

export const withDoc = Comp => {
  return class WithDoc extends Component {
    render() {
      
      return (
        <Consumer>
          {docStore => {
            return (
              <Comp
                bills={docStore.state.bills}
                state={docStore.state}
                add={docStore.add}
                update={docStore.update}
                delete={docStore.delete}
                storeCurrent={docStore.storeCurrent}
                onChange={docStore.onChange}
                onSubmit={docStore.onSubmit}
                {...this.props}
              />
            );
          }}
        </Consumer>
      );
    }
  };
};

class DocProvider extends Component {
  state = {
    isLoading: true,
    bills: [],
    current:{},
  };

  async componentDidMount() {
    const bills = await doc.get();
    console.log(bills)
    this.setState({ 
      bills,
      isLoading:false,
     });
  }

  add = (inputData) => {
    doc.add(inputData)
      .then((data) => {
        this.setState({ 
          isLoading:false,
         });
      })
      .catch((error) =>{
        throw new Error(error);
      }
      )
  }

  update = (id, inputData) => {
    doc.update(id, inputData)
      .then((data) => {
        this.setState({ 
          isLoading:false,
         });
      })
      .catch((error) =>{
        throw new Error(error);
      })
  }

  delete = (id) => {
    doc.del(id)
      .then((data) => {
        this.setState({ 
          isLoading:false,
         });
      })
      .catch((error) =>{
        throw new Error(error);
      })
  }

  get = (id) => {
    doc.get(id)
      .then((data)=>{
        this.setState({
          current:data,
          isLoading:false,
        })
      })
      .catch((error) =>{
        throw new Error(error);
      })
  }

  storeCurrent = (data) => {
    const {_id, ref, createdAt, updatedAt
      , data:{client:{name, nif, address:{street, streetNum, postalCode, country}}}
    } = data;
    
    const current = Object.assign(this.state, {
      current: {
        _id,
        ref,
        createdAt,
        updatedAt,
        name,
        nif,
        street,
        streetNum,
        postalCode,
        country,
      }
    })
    this.setState({
      current
    });
  }

  //UNUSED
  // onChange = (e) => {
  //   const { target } = e;
  //   const { name } = target;
  //   const value = target.value;
  //   const newCurrent = Object.assign(this.state.current, {[name]: value})
  //   this.setState({
  //     current: newCurrent
  //   });
  //   console.log(this.state)
  // }

  onSubmit = (values, update) => {
    if (update) {
      console.log('update data', values)
      this.update(values._id, values)
    } else {
      this.add(values)      
    }
  }

  render() {
    const { isLoading } = this.state;
    return isLoading ? (
      <div>Loading</div>
    ) : (
      <Provider
        value={{
          state: this.state,
          add: this.add,
          update:this.update,
          delete: this.delete,
          storeCurrent:this.storeCurrent,
          onChange: this.onChange,
          onSubmit: this.onSubmit,
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}

export default DocProvider;
