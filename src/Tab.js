import './Tab.css'
import Figure from './Figure'
import React, { Component } from 'react'


class Tab extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visibleTab: props.data[0].id,
      // availableFigs: {}
      availableFigs: new Set([props.data[0].id])
    }
    this.handleClick = this.handleClick.bind(this)
    this.switchTab = this.switchTab.bind(this)

    // props.data.forEach(dataItem => {
    //   this.setState((state, props) => {
    //     let newAvailableFigs = state.availableFigs
    //     newAvailableFigs[dataItem.id] = null
    //     return {
    //       visibleTab: state.visibleTab,
    //       availableFigs: newAvailableFigs
    //     }
    //   })
    // })
  }

  handleClick(id) {
    // if (this.state.availableFigs[id] == null) {
    //   this.renderTab(id);
    // }
    this.switchTab(id);
  }

  switchTab(id) {
    this.setState((state, props) => {
      let newAvailableFigs = state.availableFigs
      if (!state.availableFigs.has(id)) {
        newAvailableFigs.add(id)
      }
      return {
        visibleTab: id,
        availableFigs: newAvailableFigs
      }
    })
  }

  // renderTab(id) {
  //   this.setState((state, props) => {
  //     let newAvailableFigs = state.availableFigs
  //     newAvailableFigs[id] = 
  //       // <div key={id} style={{}}>
  //       //   <Figure data={this.props.data[Number.parseInt(id)].data} key={id}/>
  //       // </div>
  //       <Graph
  //         data={this.props.data[Number.parseInt(id)].data}
  //         id={id}
  //         visibleTab={this.state.visibleTab}></Graph>
  //     return {
  //       visibleTab: state.visibleTab,
  //       availableFigs: newAvailableFigs
  //     }
  //   })
  // }



  render() {
    const listTitles = this.props.data.map(item =>
      <li onClick={() => this.handleClick(item.id)}
        className={this.state.visibleTab === item.id ? "tab-title tab-title--active" : "tab-title"} key={item.id}>{item.tabTitle}</li>
    )

    const graphs = []
    for (const item of this.state.availableFigs) {
      graphs.push(<Graph data={this.props.data[Number.parseInt(item)].data} id={item} key={item} visibleTab={this.state.visibleTab}></Graph>)
    }

    return (
      <div className="tabs">
        <ul className="tabs-titles">
          {listTitles}
        </ul>
        {graphs}
      </div>
    )
  }

}

class Graph extends Component {
  render() {
    return (
      <div style={{display: this.props.visibleTab === this.props.id ? "" : "none"}} id={this.props.id} key={this.props.id}>
        <Figure data={this.props.data} id={this.props.id} key={this.props.id}/>
      </div>
    )
  }
}

export default Tab

