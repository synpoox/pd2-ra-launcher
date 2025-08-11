// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Fix the PATH environment variable on macOS and Linux when running a GUI app
    let _ = fix_path_env::fix();

    // Workaround for known issues with WebKitGTK and Nvidia hardware on Linux
    #[cfg(target_os = "linux")]
    std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");

    pd2_ra_launcher_lib::run()
}
