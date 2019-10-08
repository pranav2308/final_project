import React from 'react';
import './CelebrityDetection.css';

const generateRandomColor = () => {
	return ("#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}));
}

const calculateFaceLocations = (clarifaiFaces) => {
  
  let width, height;
  
  try{
  	const image = document.getElementById('inputImage');
	width = Number(image.width);
	height = Number(image.height);
  }catch(err){
  	width = 0;
  	height = 0;
  }
 
  return clarifaiFaces.map((element) => {
      const squarePercentages = element.region_info.bounding_box;
      return (
        {
          leftCol : squarePercentages.left_col * width,
          rightCol  : (1 - squarePercentages.right_col) * width,
          topRow : squarePercentages.top_row * height,
          bottomRow : (1 - squarePercentages.bottom_row) * height,
        }
      ); 
    });
  }

const generateTable = (tableEntries) => {
	return(
		<div className="pa4">
			<div className="overflow-auto">
	    		<table className="f6 w-100 mw8 center" cellSpacing="0">
		      		<tbody className = "lh-copy pa3 ml-auto mr-auto">
		      			<tr>
		      				<td className="fw6 f3 bb b--black-20 tl pa3 pr3 ">Sr.No.</td>
		      				<td className="fw6 f3 bb b--black-20 tl pa3 pr3 ">Celebrity Name</td>
				        	<td className="fw6 f3 bb b--black-20 tl pa3 pr3 ">Probability (%)</td>
				        </tr>
			        	{tableEntries}
		      		</tbody>
	    		</table>
			</div>
		</div>
	);
}

const generateResult = (clarifaiFaces) => {
	
	const faceBoxBoundries = calculateFaceLocations(clarifaiFaces);
	const noOfCelebrities = clarifaiFaces.length;
	let tableEntries = [];
	let faceBoxElement = [];

	for(let index = 0; index < noOfCelebrities; index++){
		let color = generateRandomColor();


		let celebrity = clarifaiFaces[index].data.concepts[0];
		tableEntries.push(<tr key = {index}>
				<td style = {{color : color}} className="fw6 pv3 f4 pr3 bb">{index + 1}</td>
				<td style = {{color : color}} className="fw6 pv3 f4 pr3 bb">{celebrity.name}</td>
				<td style = {{color : color}} className="fw6 pv3 f4 pr3 bb">{Math.round(celebrity.value * 100).toString().concat('%')}</td>
			</tr>);

		let box = faceBoxBoundries[index];
		let style = {top : box.topRow, bottom : box.bottomRow, left : box.leftCol, right : box.rightCol, boxShadow: `0 0 0 3px ${color} inset`};
		faceBoxElement.push(<div className = "celeb-bounding-box" style = {style} key = {index}></div>);
	}

	return (
		{
			tableElement : generateTable(tableEntries),
			faceBoxElement : faceBoxElement	
		}
	);
}

const CelebrityDetection = ({ imageStatus, imageUrl, apiResponse }) => {
	let tableElement, faceBoxElement;
	if(imageStatus === 'valid'){

		if (apiResponse !== ''){
			const clarifaiFaces = apiResponse.outputs[0].data.regions;
			if(clarifaiFaces){
				//{ tableElement, faceBoxElement } = generateResult(clarifaiFaces);
				const result = generateResult(clarifaiFaces);
				tableElement = result.tableElement;
				faceBoxElement = result.faceBoxElement; 
			}
		}

		
	}
	else if (imageStatus === 'invalid'){
		return(<div className = 'center ma'>
							<p className = 'mt4 f4 fw5'>{"Link does not redirects to image. Please check the link and try again"}</p>
						</div>);
		 
	}
	if(!tableElement){
		tableElement = <p className = 'mt4 f4 fw5'>{"Processing........"}</p>
	}
	return (
		<div>
			{tableElement}
			<div className = 'center ma'>
				<div className = 'absolute mt2'>
					<img id = "inputImage" alt = 'Input image' src = {imageUrl} width = '500px' height = 'auto' style = {{ border: '3px solid #021a40' }}/>
					{faceBoxElement}
				</div>

			</div>
			
			

		</div>
	);
}

export default CelebrityDetection;