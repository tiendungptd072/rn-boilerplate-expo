export type AppEnvironment = 'development' | 'preview' | 'production';

export type BrandConfig = {
  androidPackage: string;
  initialized: boolean;
  iosBundleIdentifier: string;
  name: string;
  scheme: string;
  slug: string;
  version: string;
};

export type InitProjectConfig = Omit<BrandConfig, 'initialized'> & {
  assets?: {
    androidBackground?: string;
    androidForeground?: string;
    androidMonochrome?: string;
    favicon?: string;
    icon?: string;
    iosIcon?: string;
    splash?: string;
  };
};

type Parser<T> = {
  parse(value: unknown): T;
};

export const appEnvironmentSchema: Parser<AppEnvironment>;
export const brandConfigSchema: Parser<BrandConfig>;
export const initProjectConfigSchema: Parser<InitProjectConfig>;

export function assertProductionReady(
  brand: BrandConfig,
  environment: AppEnvironment,
  easProjectId?: string,
): void;

export function resolveAppEnvironment(
  environment: Record<string, string | undefined>,
): AppEnvironment;

export function resolveAppVariant(
  brand: BrandConfig,
  environment: AppEnvironment,
): {
  androidPackage: string;
  iosBundleIdentifier: string;
  name: string;
  scheme: string;
};
