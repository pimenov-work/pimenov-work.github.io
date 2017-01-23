import React, { PropTypes } from 'react';

function PlayerStatsGraph({ player, cssClass, dX, dY }) {
  const chart = [];
  const numberOfPoints = 5;

  if (player && player.shape && player.shape.length > 0) {
    let x = 4;
    let y = 20;
    const averageValue = player.avg;

    // Gray line
    const averageLine = <line key={'average'} stroke="#DDDDDD" strokeWidth="1" x1={0} y1={22} x2={(numberOfPoints + 1) * dX} y2={22} />;
    chart.push(averageLine);

    // Chart polyline
    const path = [];
    player.shape.forEach((roundScore, i) => {
      x = dX * (i + 1 + numberOfPoints - player.shape.length);
      y = dY * (averageValue - roundScore) + 22;
      path.push(`${x} ${y}`);
    });
    chart.push(<polyline key={'chart'} points={path.join(',')} fill="none" stroke="#0069ea" />);
  }

  const svgStyle = {
    width: dX * (numberOfPoints + 1)
  };

  return <svg className={cssClass} style={svgStyle}>{chart}</svg>;
}

PlayerStatsGraph.propTypes = {
  player: PropTypes.object,
  cssClass: PropTypes.string,
  dX: PropTypes.number,
  dY: PropTypes.number
};

export default PlayerStatsGraph;
