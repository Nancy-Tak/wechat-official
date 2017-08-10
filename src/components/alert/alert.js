import React from "react";

import './alert.less';

export default class AlertComponent extends React.Component{
	constructor(props){
		super(props);
		// console.log(props);
		
	}   

	render(){
		console.log(this.props);
		const {linedTitle,title,subTitle,buttons} = this.props;
		return (
			<div className="alert-wrap">
			    <div className="alert-padding">
				    <div className="alert-box">
				        <div className="alert-title-box">
				    	    <div className="alert-title"><span className="alert-line">{linedTitle}</span>{title}</div>
				    	    <div className="alert-subtitle">{subTitle}</div>
				    	</div>
				    	<div className="alert-buttons">
				    		<div className="alert-buttons-left" onClick={buttons.left.onPress}>{buttons.left.text}</div>
				    		<div className="alert-buttons-right" onClick={buttons.right.onPress}>{buttons.right.text}</div>
				    	</div>
				    	<div className="alert-close" onClick={buttons.close.onPress}><i className="icon-close"></i></div>
				    </div>
				</div>
			</div>
		)
	}
}