import { __assign } from 'tslib';

import {
  isArrayLike,
  isBoolean,
  isElement,
  isNumber,
  isString,
  isObject,
  isFunction
} from './util';

export {
  DOM,
} from './shortcut';

export const SVGNamespace = 'http://www.w3.org/2000/svg';

export function preventDefault(event: Event) {
  event.preventDefault();
  return event;
}
export function stopPropagation(event: Event) {
  event.stopPropagation();
  return event;
}

// https://facebook.github.io/react/docs/jsx-in-depth.html#booleans-null-and-undefined-are-ignored
// Emulate JSX Expression logic to ignore certain type of children or className.
function isVisibleChild( value: any ) {
  return !isBoolean(value) && value != null;
}

/**
 * Convert a `value` to a className string.
 * `value` can be a string, an array or a `Dictionary<boolean>`.
 */
export function className( value: string | (string | boolean)[] | { [className: string]: boolean} ): string {
  if (Array.isArray( value )) {
    return value.filter( isVisibleChild ).join(' ');
  } else if (isObject( value )) {
    return Object.keys( value ).filter( k => value[k] ).join(' ');
  } else {
    return '' + value;
  }
}

const svg = __assign(Object.create(null), {
  // SVG
  svg: 0,
  animate: 0,
  circle: 0,
  clipPath: 0,
  defs: 0,
  desc: 0,
  ellipse: 0,
  feBlend: 0,
  feColorMatrix: 0,
  feComponentTransfer: 0,
  feComposite: 0,
  feConvolveMatrix: 0,
  feDiffuseLighting: 0,
  feDisplacementMap: 0,
  feDistantLight: 0,
  feFlood: 0,
  feFuncA: 0,
  feFuncB: 0,
  feFuncG: 0,
  feFuncR: 0,
  feGaussianBlur: 0,
  feImage: 0,
  feMerge: 0,
  feMergeNode: 0,
  feMorphology: 0,
  feOffset: 0,
  fePointLight: 0,
  feSpecularLighting: 0,
  feSpotLight: 0,
  feTile: 0,
  feTurbulence: 0,
  filter: 0,
  foreignObject: 0,
  g: 0,
  image: 0,
  line: 0,
  linearGradient: 0,
  marker: 0,
  mask: 0,
  metadata: 0,
  path: 0,
  pattern: 0,
  polygon: 0,
  polyline: 0,
  radialGradient: 0,
  rect: 0,
  stop: 0,
  switch: 0,
  symbol: 0,
  text: 0,
  textPath: 0,
  tspan: 0,
  use: 0,
  view: 0,
});

export function createElement( tag, attr, ...children ) {
  attr = attr || {};
  let node: Element;
  if (isString( tag )) {
     node =
      'namespaceURI' in attr ? document.createElementNS( attr.namespaceURI, tag )
      : tag in svg ? document.createElementNS( SVGNamespace, tag )
      : document.createElement( tag );
    attributes( attr, node );
    append( children, node );
  } else if (isFunction( tag )) {
    // Custom elements.
    node = tag({ ...attr, children });
  }
  if("ref" in attr && isFunction(attr.ref)) {
    attr.ref(node);
  }
  return node;
}

function append( children, node = this ) {
  if (isElement( children ) || isString( children )) {
    children = [ children ];
  }
  for (let child of children) {
    if (isArrayLike( child )) {
      append( child, node );
    } else if (isString( child ) || isNumber( child )) {
      node.appendChild( document.createTextNode( child as any ) );
    } else if (child === null) {
      node.appendChild( document.createComment('') );
    } else if (isElement( child )) {
      node.appendChild( child );
    }
  }
  return node;
}

function attributes( attr, node ) {
  for (let key of Object.keys(attr)) {
    let value = attr[key];

    switch (key) {
      case 'ref':
        continue;
      case 'style':
        typeof value === 'object'
        ? __assign( node[key], value )
        : node.style = value;
        continue;
      case 'dataset':
        __assign( node[key], value );
        continue;
      case 'innerHTML':
      case 'innerText':
      case 'textContent':
        node[key] = value;
        continue;
      case 'class':
      case 'className':
        node.setAttribute('class', className( value ));
        continue;
      case 'namespaceURI':
        continue;
    }

    if (isFunction( value )) {
      if (key.startsWith('on')) {
        let name = key.slice(2).toLowerCase();
        listen( node, name, value );
      } else {
        value = value.call( node, node.getAttribute( key ));
        node.setAttribute( key, value );
      }
    } else if ( node ) {
      if ( value === true ) {
        node.setAttribute( key, '' );
      } else if ( value !== false && value != null ) {
        node.setAttribute( key, value );
      }
    }
  }
  return node;
}


function listen( node, eventName, callback ) {
  node.addEventListener( eventName, callback );
  return node;
}
