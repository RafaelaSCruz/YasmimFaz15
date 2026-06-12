precision highp float;

uniform mat4 u_MVP;

attribute vec4 a_position;


void main () {
    gl_Position = u_MVP * a_position;
}