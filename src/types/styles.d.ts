// Tipos para CSS Modules (*.module.scss)
declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Tipos para imports globales (*.scss)
declare module "*.scss";
