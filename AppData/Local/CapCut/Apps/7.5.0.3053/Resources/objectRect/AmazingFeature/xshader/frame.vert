precision highp float;

uniform mat4 u_MVP;
uniform vec2 u_size;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

varying vec2 v_xy;
 
void main () {
    v_xy = a_texcoord0 * u_size;
    gl_Position = u_MVP * a_position;
}