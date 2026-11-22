import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { BackHandler } from 'react-native';
import {
  NavigationProvider,
  useNavigation,
  NavigationActions,
} from '../../../src/presentation/navigation/NavigationProvider';
import {
  detailRoute,
  homeRoute,
  ScreenName,
} from '../../../src/presentation/navigation/routes';

interface ProbeProps {
  readonly onResult: (navigation: NavigationActions) => void;
}

const NavigationProbe = ({ onResult }: ProbeProps) => {
  const navigation = useNavigation();
  onResult(navigation);
  return null;
};

const pokemon = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'pikachu.png',
};

describe('NavigationProvider', () => {
  let hardwareBackHandler: () => boolean;
  let removeMock: jest.Mock;

  beforeEach(() => {
    removeMock = jest.fn();
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation(
      (_event, handler) => {
        hardwareBackHandler = handler;
        return { remove: removeMock };
      },
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('inicia en la ruta Home y no permite ir atrás', async () => {
    const onResult = jest.fn();

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        React.createElement(NavigationProvider, {
          children: React.createElement(NavigationProbe, { onResult }),
        }),
      );
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        currentRoute: homeRoute(),
        canGoBack: false,
      }),
    );
  });

  it('navega al detalle y permite volver atrás', async () => {
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(NavigationProvider, {
          children: React.createElement(NavigationProbe, { onResult }),
        }),
      );
    });

    await ReactTestRenderer.act(() => {
      const navigation = onResult.mock.calls.at(-1)?.[0] as
        NavigationActions;
      navigation.navigate(detailRoute(pokemon));
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        currentRoute: expect.objectContaining({
          name: ScreenName.Detail,
          params: { pokemon },
        }),
        canGoBack: true,
      }),
    );

    await ReactTestRenderer.act(() => {
      const navigation = onResult.mock.calls.at(-1)?.[0] as
        NavigationActions;
      navigation.goBack();
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        currentRoute: homeRoute(),
        canGoBack: false,
      }),
    );

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });

  it('no elimina la ruta Home al intentar volver más atrás', async () => {
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(NavigationProvider, {
          children: React.createElement(NavigationProbe, { onResult }),
        }),
      );
    });

    await ReactTestRenderer.act(() => {
      const navigation = onResult.mock.calls.at(-1)?.[0] as
        NavigationActions;
      navigation.goBack();
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        currentRoute: homeRoute(),
        canGoBack: false,
      }),
    );

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });

  it('consume el botón físico al haber una ruta anterior', async () => {
    const onResult = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(NavigationProvider, {
          children: React.createElement(NavigationProbe, { onResult }),
        }),
      );
    });

    await ReactTestRenderer.act(() => {
      (onResult.mock.calls.at(-1)?.[0] as NavigationActions)
        .navigate(detailRoute(pokemon));
    });

    await ReactTestRenderer.act(() => {
      expect(hardwareBackHandler()).toBe(true);
    });

    expect(onResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        currentRoute: homeRoute(),
        canGoBack: false,
      }),
    );

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });

  it('permite salir con el botón físico desde Home', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        React.createElement(NavigationProvider, {
          children: React.createElement(NavigationProbe, {
            onResult: jest.fn(),
          }),
        }),
      );
    });

    expect(hardwareBackHandler()).toBe(false);

    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
    expect(removeMock).toHaveBeenCalledTimes(1);
  });
});