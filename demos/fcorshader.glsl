precision mediump float;
varying vec4 vColor;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform vec3 uAmbientColor;

uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingSpecularColor;
uniform vec3 uPointLightingDiffuseColor;

uniform float uMaterialShininess;

void main(void)
{
  vec3 lightWeighting;
  vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);
  vec3 normal = normalize(vTransformedNormal);
  float specularLightWeighting = 0.0;
  vec3 eyeDirection = normalize(-vPosition.xyz);
  vec3 reflectionDirection = reflect(-lightDirection, normal);
  specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);
  float diffuseLightWeighting = max(dot(normal,lightDirection),0.0);
  lightWeighting = uAmbientColor + uPointLightingSpecularColor * specularLightWeighting + uPointLightingDiffuseColor * diffuseLightWeighting;
  gl_FragColor = vec4(vColor.rgb * lightWeighting, vColor.a);
}