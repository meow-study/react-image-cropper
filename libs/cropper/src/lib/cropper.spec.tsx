import { render } from '@testing-library/react';

import Cropper from './cropper';

describe('Cropper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Cropper />);
    expect(baseElement).toBeTruthy();
  });
});
