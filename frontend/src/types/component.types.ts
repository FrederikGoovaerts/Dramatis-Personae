import * as React from 'react';

export interface TabContent {
    name: string;
    component: () => React.ReactNode;
}
