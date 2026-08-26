import { Redirect } from 'expo-router';

import { ComponentGallery } from '@/dev/component-gallery';

export default function ComponentGalleryRoute() {
  if (!__DEV__) return <Redirect href="/" />;

  return <ComponentGallery />;
}
