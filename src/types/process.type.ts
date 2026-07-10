export type MainMessage =
    | {
          type: "shutdown";
      }
    | {
          type: "boot";
          data: {
              path: string;
              option: Record<string, unknown>;
          };
      }
    | {
          type: "reload";
      };

export type ServerMessage =
    | {
          type: "ready";
          data: {
              port: number;
          };
      }
    | {
          type: "error";
          message: string;
      }
    | {
          type: "stopped";
      };
