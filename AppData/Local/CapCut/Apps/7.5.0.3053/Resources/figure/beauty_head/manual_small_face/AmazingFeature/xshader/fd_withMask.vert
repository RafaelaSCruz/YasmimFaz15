precision highp float;
attribute vec3 position;
attribute vec2 texcoord0;
attribute vec2 texcoord1;

varying vec2 origCoord;
varying vec2 maskCoord;

void main()
{
    gl_Position = vec4(position.x, position.y, 0.0, 1.0);
    origCoord = texcoord0;
    maskCoord = texcoord1;
}
