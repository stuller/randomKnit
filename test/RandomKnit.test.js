import React from "react";
import { BrowserRouter, useNavigate, useLocation} from "react-router-dom";
import { QueryParamProvider } from 'use-query-params';
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import RandomKnit from "../src/RandomKnit";

const RouteAdapter = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adaptedHistory = React.useMemo(
    () => ({
      replace(location) {
        navigate(location, { replace: true, state: location.state });
      },
      push(location) {
        navigate(location, { replace: false, state: location.state });
      },
    }),
    [navigate]
  );
  return children({ history: adaptedHistory, location });
};

describe("RandomKnit first load tests", function () {
  afterEach(() => {
    cleanup();
  });
  it("Headers should be in the doc with default text", function () {
    let { getByText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );
    expect(getByText("Random Knit")).toBeInTheDocument;
    expect(getByText("Basic setup")).toBeInTheDocument;
    expect(getByText("Options")).toBeInTheDocument;
    expect(getByText("Chart")).toBeInTheDocument;
    expect(getByText("Untitled")).toBeInTheDocument;
  });

  it("Basic setup fields and labels should be in the doc with default values", function () {
    let { getByLabelText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );

    expect(getByLabelText("Title:")).toBeInTheDocument;
    expect(getByLabelText("Title:").value).toBe("Untitled");
    expect(getByLabelText("Type:")).toBeInTheDocument;
    expect(getByLabelText("Type:").value).toBe("2-color");
    expect(getByLabelText("Rows:")).toBeInTheDocument;
    expect(getByLabelText("Rows:").value).toBe("6");
    expect(getByLabelText("Stitches:")).toBeInTheDocument;
    expect(getByLabelText("Stitches:").value).toBe("6");
  });

  it("Options fields and labels should be in the doc with default values", function () {
    let { getByLabelText, queryByLabelText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );

    expect(getByLabelText("Mirror Horizontal:")).toBeInTheDocument;
    expect(getByLabelText("Mirror Horizontal:").checked).toBe(true);
    expect(getByLabelText("Mirror Vertical:")).toBeInTheDocument;
    expect(getByLabelText("Mirror Vertical:").checked).toBe(true);
    expect(getByLabelText("Main Color:")).toBeInTheDocument;
    expect(getByLabelText("Main Color:").value).toBe('#ffffff');
    expect(getByLabelText("Contrast Color:")).toBeInTheDocument;
    expect(getByLabelText("Contrast Color:").value).toBe('#f97697');
    expect(queryByLabelText("Contrast Color 2:")).toBe(null)
  });

  it("Buttons appear as they should", function () {
    let { getByText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );

    expect(getByText("Create Chart")).toBeInTheDocument;
    expect(getByText("Download Chart")).toBeInTheDocument;
    expect(getByText("Rotate Tile")).toBeInTheDocument;
  });

  it("Tile, chart and preview appear", async function () {
    let { getByTestId } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );
    const tile = await waitFor(() => getByTestId('tile'));
    expect(tile).toBeInTheDocument;
    expect(tile.querySelectorAll('.row').length).toBe(6);
    expect(tile.querySelectorAll('.stitch').length).toBe(36);
    expect(tile.querySelectorAll('.stitch-0').length).not.toBe(0);
    expect(tile.querySelectorAll('.stitch-1').length).not.toBe(0);
    expect(tile.querySelectorAll('.stitch-2').length).toBe(0);

    const chart = await waitFor(() => getByTestId('chart'));
    expect(chart).toBeInTheDocument;
    expect(chart.querySelectorAll('.tile').length).toBe(4);
    expect(chart.querySelector('#rowLabels')).toBeInTheDocument;
    expect(chart.querySelector('#stitchLabels')).toBeInTheDocument;
    expect(chart.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML);
    expect(chart.querySelectorAll('.mirrorH').length).toBe(2);
    expect(chart.querySelectorAll('.mirrorV').length).toBe(2);

    const preview = await waitFor(() => getByTestId('preview'));
    expect(preview).toBeInTheDocument;
    expect(preview.querySelectorAll('.tile').length).toBe(64);
    expect(preview.querySelectorAll('img').length).toBe(2304);
    expect(preview.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML);
    expect(preview.querySelectorAll('.mirrorH').length).toBe(32);
    expect(preview.querySelectorAll('.mirrorV').length).toBe(32);

  });
  
});

describe("Update setup", function () {

  afterEach(() => {
    cleanup();
  });
  it("Update type updates tiles, chart, preview and url", async function () {
    //TODO: need to fix code to ensure that when 3 colors are chosen, all three are used

    let { getByTestId, getByText, getByLabelText, queryByTestId } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );
    
    fireEvent.change(getByLabelText('Type:'), {target: {value: '3-color-stranded'}});
    fireEvent.click(getByText('Create Chart'), {});

    const tile = await waitFor(() => getByTestId('tile'));
    expect(tile.querySelectorAll('.stitch-0').length).not.toBe(0);
    expect(tile.querySelectorAll('.stitch-1').length).not.toBe(0);
    expect(tile.querySelectorAll('.stitch-2').length).not.toBe(0);

    const chart = await waitFor(() => getByTestId('chart'));
    expect(chart).toBeInTheDocument;
    expect(chart.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML)

    const preview = await waitFor(() => getByTestId('preview'));
    expect(preview).toBeInTheDocument;
    expect(preview.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML)

    expect(document.location.search).toContain('type=3-color-stranded');
    expect(document.location.search).toContain('tileData=')

    fireEvent.change(getByLabelText('Type:'), {target: {value: '3-color-fair-isle'}});
    fireEvent.click(getByText('Create Chart'), {});

    expect(tile.querySelectorAll('.stitch-0').length).not.toBe(0);
    expect(tile.querySelectorAll('.stitch-1').length).not.toBe(0);
    expect(tile.querySelectorAll('.stitch-2').length).not.toBe(0);

    expect(chart).toBeInTheDocument;
    expect(chart.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML)

    expect(preview).toBeInTheDocument;
    expect(preview.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML)

    expect(document.location.search).toContain('type=3-color-fair-isle');
    expect(document.location.search).toContain('tileData=')
    await waitFor(() => getByTestId('rotateWarning'));
    expect(getByTestId('rotateWarning')).toBeInTheDocument;

    fireEvent.change(getByLabelText('Type:'), {target: {value: '2-color'}});
    fireEvent.click(getByText('Create Chart'), {});

    expect(tile.querySelectorAll('.stitch-0').length).not.toBe(0);
    expect(tile.querySelectorAll('.stitch-1').length).not.toBe(0);
    expect(tile.querySelectorAll('.stitch-2').length).toBe(0);
    
    expect(chart).toBeInTheDocument;
    expect(chart.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML)

    expect(preview).toBeInTheDocument;
    expect(preview.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML)

    expect(document.location.search).toContain('type=2-color');
    expect(document.location.search).toContain('tileData=');
    expect(queryByTestId('rotateWarning')).toBe(null);

  });

  it("Update title updates chart info header and url", async function () {
    let { getByText, getByLabelText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );
    fireEvent.blur(getByLabelText('Title:'), {target: {value: 'ooh spaces'}});

    await waitFor(() => getByText('ooh spaces'));
    expect(document.location.search).toContain('title=ooh%20spaces');
    expect(getByText('ooh spaces')).toBeInTheDocument;
  });

  it("Row and Stitches changes update tile, chart, preview, and url", async function () {
    let { getByTestId, getByLabelText, getByText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );

    fireEvent.blur(getByLabelText('Rows:'), {target: {value: '3'}});
    fireEvent.blur(getByLabelText('Stitches:'), {target: {value: '3'}});

    fireEvent.click(getByText('Create Chart'), {});

    expect(document.location.search).toContain('rows=3');
    expect(document.location.search).toContain('stitches=3');

    const tile = await waitFor(() => getByTestId('tile'));
    expect(tile).toBeInTheDocument;
    expect(tile.querySelectorAll('.row').length).toBe(3);
    expect(tile.querySelectorAll('.stitch').length).toBe(9);

    const chart = await waitFor(() => getByTestId('chart'));
    expect(chart).toBeInTheDocument;
    expect(chart.querySelectorAll('.tile').length).toBe(4);
    expect(chart.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML)

    const preview = await waitFor(() => getByTestId('preview'));
    expect(preview).toBeInTheDocument;
    expect(preview.querySelectorAll('.tile').length).toBe(256);
    expect(preview.querySelectorAll('img').length).toBe(2304);
    expect(preview.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML)
  });

  it("Download chart button calls handleDownloadChart", async function () {

    const utils = require('../src/common/utils');
    jest.spyOn(utils, 'handleDownloadChart').mockImplementation(() => {});

    let { getByText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );

    fireEvent.click(getByText('Download Chart'), {});

    expect(utils.handleDownloadChart).toHaveBeenCalledTimes(1);
  });

});

describe("Update options", function () {
  afterEach(() => {
    cleanup();
  });
  it("Update mirrorH, mirrorV updates preview, chart, and url", async function () {
    let { getByTestId, getByLabelText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );
    fireEvent.blur(getByLabelText('Rows:'), {target: {value: '6'}});
    fireEvent.blur(getByLabelText('Stitches:'), {target: {value: '6'}});
    fireEvent.click(getByLabelText('Mirror Horizontal:'), {});
    fireEvent.click(getByLabelText('Mirror Vertical:'), {});

    expect(document.location.search).toContain('mirrorH=0');
    expect(document.location.search).toContain('mirrorV=0');

    const tile = await waitFor(() => getByTestId('tile'));
    const chart = await waitFor(() => getByTestId('chart'));
    expect(chart).toBeInTheDocument;
    expect(chart.querySelectorAll('.tile').length).toBe(1);
    expect(chart.querySelectorAll('.tile')[0].innerHTML).toEqual(tile.querySelectorAll('.tile')[0].innerHTML);
    expect(chart.querySelectorAll('.mirrorH').length).toBe(0);
    expect(chart.querySelectorAll('.mirrorV').length).toBe(0);

    const preview = await waitFor(() => getByTestId('preview'));
    expect(preview.querySelectorAll('.mirrorH').length).toBe(0);
    expect(preview.querySelectorAll('.mirrorV').length).toBe(0);
  });

  it("Update colors updates preview, chart, and url", async function () {
    let { getByText, getByLabelText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );

    fireEvent.change(getByLabelText('Type:'), {target: {value: '3-color-stranded'}});
    fireEvent.blur(getByLabelText('Main Color:'), {target: {value: '#ffffff'}});
    fireEvent.blur(getByLabelText('Contrast Color:'), {target: {value: '#000000'}});
    fireEvent.blur(getByLabelText('Contrast Color 2:'), {target: {value: '#333333'}});
    fireEvent.click(getByText('Create Chart'), {});

    expect(document.location.search).toContain('mc=%23ffffff');
    expect(document.location.search).toContain('cc=%23000000');
    expect(document.location.search).toContain('cc2=%23333333');

    expect(document.querySelectorAll('.stitch-0')[0].style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(document.querySelectorAll('.stitch-1')[0].style.backgroundColor).toBe('rgb(0, 0, 0)');
    expect(document.querySelectorAll('.stitch-2')[0].style.backgroundColor).toBe('rgb(51, 51, 51)');
  });

  it("Rotate tile changes fair isle to stranded", async function () {
    let { getByText, getByTestId, getByLabelText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );
    fireEvent.change(getByLabelText('Type:'), {target: {value: '3-color-fair-isle'}});
    fireEvent.blur(getByLabelText('Rows:'), {target: {value: '6'}});
    fireEvent.blur(getByLabelText('Stitches:'), {target: {value: '6'}});
    fireEvent.click(getByText('Create Chart'), {});

    fireEvent.click(getByText('Rotate Tile'), {});
    
    expect(document.location.search).toContain('type=3-color-stranded')
  });

  it("Rotate tile rotates the tile and updates the url", async function () {
    let { getByText, getByLabelText } = render(
      <>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            <RandomKnit/>
        </QueryParamProvider>
      </BrowserRouter>
      </>
    );

    fireEvent.blur(getByLabelText('Rows:'), {target: {value: '2'}});
    fireEvent.blur(getByLabelText('Stitches:'), {target: {value: '2'}});
    fireEvent.click(getByText('Create Chart'), {});

    const params = new URLSearchParams(document.location.search);
    const tileData = params.get('tileData');

    fireEvent.click(getByText('Rotate Tile'), {});
    const newParams = new URLSearchParams(document.location.search);
    const newTileData = newParams.get('tileData');

    const expectedNewTileData = `${tileData[3]}${tileData[0]}-${tileData[4]}${tileData[1]}`;

    expect(newTileData).toEqual(expectedNewTileData);
  });

});


