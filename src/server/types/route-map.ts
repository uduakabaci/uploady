export type RoutedRequest = Request & { params?: Record<string, string> };

export type RouteHandler = (req: RoutedRequest) => Response | Promise<Response>;

export type RouteMap = Record<string, RouteHandler>;
