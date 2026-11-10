{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
    packages = [
        pkgs.bun
        pkgs.openssl
        pkgs.prisma-engines_6
    ];
    shellHook = ''
        export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines_6}/bin/schema-engine"
        export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines_6}/bin/query-engine"
        export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines_6}/lib/libquery_engine.node"
        exec zsh
    '';
}
