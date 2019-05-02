import React, { Component, Fragment } from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

const assignBorder = (props) => {
    return props.borderSize + "px " + props.borderStyle + " " + props.borderColor; 
   
}

const StyleWrapper = styled.div`    
    transform:rotateY(180deg);
    text-align:center;
    
    .halfStar, .fullStar{
        display:inline-block;
        height: ${props => props.cssProps.size}px;
        width: ${props => props.cssProps.size/2}px;
        border-top: ${props => assignBorder(props.cssProps.border)};
        border-bottom:${props => assignBorder(props.cssProps.border)};;
        background-color: ${props => props.cssProps.emptyColor};
    }

    .halfStar{
        border-left: ${props => assignBorder(props.cssProps.border)};;
        margin-left: ${props => props.cssProps.margin}px;           
        border-top-left-radius: ${props => props.cssProps.size}px;
        border-bottom-left-radius: ${props => props.cssProps.size}px;         
    }

    .fullStar{
        border-right: ${props => assignBorder(props.cssProps.border)};
        margin-right:${props => props.cssProps.margin}px;      
        border-top-right-radius: ${props => props.cssProps.size}px;
        border-bottom-right-radius: ${props => props.cssProps.size}px; 
    }

    .fullStar:hover,.halfStar:hover{
        background-color: ${props => props.cssProps.selectedColor};
    }

    .fullStar:hover ~ .halfStar, .fullStar:hover ~ .fullStar{
        background-color:${props => props.cssProps.selectedColor};
    }

    .halfStar:hover ~ .fullStar, .halfStar:hover ~ .halfStar{
        background-color:${props => props.cssProps.selectedColor};
    }

    .rating{
        background-color:${props => props.cssProps.selectedColor};
    }
`

class HalfRating extends Component{ 
    maxRating = parseInt(this.props.maxRating);
    cssProps = {
        selectedColor:this.props.selectedColor,
        emptyColor:this.props.emptyColor,
        size:this.props.size,
        border:{
            borderColor:this.props.border.borderColor,
            borderSize:this.props.border.borderSize,
            borderStyle:this.props.border.borderStyle
        },
        margin:this.props.margin        
    };   

    constructor(props){
        super(props);
        let currentRating = Number(props.currentRating).toPrecision(2);
        let decimal = (currentRating * 10)%10; 
        if(decimal < 5){
            currentRating = parseInt(currentRating);
        }else if(decimal > 5){
            currentRating = parseInt(currentRating) + 0.5
        }

        this.state = {
            currentRating: currentRating
        };
    }
    

    markRating = (id,cName) => {
        let currentRating;
        if(cName == "halfStar"){ currentRating = parseInt(id); }
        else if(cName == "fullStar"){ currentRating = parseInt(id) - 0.5; }

        this.setState({currentRating:currentRating},() => {
            console.log(this.state.currentRating);
            this.props.updateRating(this.state.currentRating);
        })
    }

    addRating = (id) => {
        let point = id - this.state.currentRating;
        if(id <= this.state.currentRating){
            return ["rating","rating"];
        }else if(id > this.state.currentRating && (point == 0.5)){
            return ["","rating"];
        }else{
            return ["",""];
        }
    }

    createStars = () => {
        let arr=[];

        for(let i=this.maxRating; i>=1; i--){
            let a = i;
            let classes = this.addRating(i);

            arr.push(<Fragment key={i-1}>
                <Tooltip title={i} placement="top-end" TransitionComponent={Zoom}>
                    <div className={"halfStar " + classes[0] } id={a}
                        onClick={(event) => this.markRating(event.currentTarget.id,"halfStar")}></div>
                </Tooltip>
                
                <Tooltip title={i - 0.5} placement="top-start" TransitionComponent={Zoom}>
                    <div className={"fullStar " + classes[1]} id={a}
                        onClick={(event) => this.markRating(event.currentTarget.id,"fullStar")}></div>
                </Tooltip>
                
            </Fragment>)
        }       
        return arr;
    }

    render(){
        return (<StyleWrapper cssProps={this.cssProps}>
            {this.createStars()}
        </StyleWrapper>)
    }
}

export default HalfRating;

const verifyBorder = (propValue,key,compName,location,propFullName) => {
    let type = typeof(propValue[key]);
    console.log(propValue[key],typeof(propValue[key]));
    let err = "Invalid value " + key + "supplied " + compName;
    switch(key){
        case "borderColor":
        case "borderStyle":{
            if(type != "string") return err;            
        }            
        case "borderSize":{
            if(type != "number") return err;            
        }           
    }   
}

HalfRating.propTypes = {
    size:PropTypes.number,
    selectedColor:PropTypes.string,
    emptyColor:PropTypes.string,
    border:PropTypes.objectOf(verifyBorder),
    margin:PropTypes.number,
    maxRating:PropTypes.number,
    currentRating:PropTypes.number,
    updateRating:PropTypes.func.isRequired
}

HalfRating.defaultProps = {
    size:50,
    selectedColor:"yellow",
    emptyColor:"transparent",
    border:{
        borderColor:"#ccc",
        borderStyle:"solid",
        borderSize:1       
    },
    margin:5,  
    maxRating:5,
    currentRating:0
}



