import * as React from 'react';
// @ts-ignore
import SVGInline from 'react-svg-inline';

// @ts-ignore
import personaeSvg = require('./personae.svg');
// @ts-ignore
import personaeNoCircleSvg = require('./personae_no_circle.svg');

export interface SVGIconProps {
    color?: string;
    className: string;
    width: number;
    height: number;
}

// eslint-disable-next-line
const createSvgIcon = (props: SVGIconProps, source: any) => {
    const { width, color, height, className } = props;
    return (
        <SVGInline
            fill={color}
            component={'div'}
            className={className}
            width={`${width}em`}
            height={`${height}em`}
            svg={source}
        />
    );
};

export const PersonaeIcon = (props: SVGIconProps) => createSvgIcon(props, personaeSvg);
export const PersonaeNoCircleIcon = (props: SVGIconProps) => createSvgIcon(props, personaeNoCircleSvg);
