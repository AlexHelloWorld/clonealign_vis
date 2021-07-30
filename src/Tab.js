import './Tab.css'
import Heatmap from './Heatmap'
import React, { Component } from 'react'


function Tab(props){
  
  const [visibleTab, setVisibleTab] = React.useState(props.data[0].id)

  const listTitles = props.data.map((item) => 
      <li onClick={() => setVisibleTab(item.id)} className={visibleTab === item.id ? "tab-title tab-title--active" : "tab-title"}>{item.tabTitle}</li>
  )       
                                   
  const listContent = props.data.map((item) => 
      <p style={visibleTab === item.id ? {} : {display: 'none'}}>{item.tabContent}<Heatmap data={item.data}/></p>
  )
  
  return(
      <div className="tabs">
        <ul className="tabs-titles">
          {listTitles}
        </ul>
        <div className="tab-content">
           {listContent}
        </div>
      </div>
    )
}

export default Tab

