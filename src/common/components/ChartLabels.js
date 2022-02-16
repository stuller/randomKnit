import * as React from 'react'
import PropTypes from 'prop-types';

export default function ChartLabels(props) {
    const {id, count, className} = props;
    const labels = [];
    for(let i = count; i > 0; i--) {
        labels.push(<div key={i} className="chartLabel">{i}</div>)
    }
    return (
        <div id={id} className={className}>
            {labels}
        </div>
    );
}

ChartLabels.propTypes = {
    id: PropTypes.string,
    count: PropTypes.number,
    className: PropTypes.string
};
  