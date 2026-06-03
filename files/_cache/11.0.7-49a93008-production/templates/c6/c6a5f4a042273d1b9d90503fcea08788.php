<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* components/dashboard/widget_form.html.twig */
class __TwigTemplate_32da896663eea9a3e732718e67c2cefa extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 32
        yield "
";
        // line 33
        $macros["fields"] = $this->macros["fields"] = $this->load("components/form/fields_macros.html.twig", 33)->unwrap();
        // line 34
        yield "
";
        // line 35
        $context["field_options"] = ["full_width" => true];
        // line 38
        yield "
";
        // line 39
        $context["rand"] = Twig\Extension\CoreExtension::random($this->env->getCharset());
        // line 40
        yield "
<form class=\"display-widget-form\">

   <input type=\"hidden\" name=\"gridstack_id\" value=\"";
        // line 43
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["gridstack_id"] ?? null), "html", null, true);
        yield "\" />
   <input type=\"hidden\" name=\"old_id\" value=\"";
        // line 44
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["old_id"] ?? null), "html", null, true);
        yield "\" />
   <input type=\"hidden\" name=\"x\" value=\"";
        // line 45
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["x"] ?? null), "html", null, true);
        yield "\" />
   <input type=\"hidden\" name=\"y\" value=\"";
        // line 46
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["y"] ?? null), "html", null, true);
        yield "\" />
   <input type=\"hidden\" name=\"width\" value=\"";
        // line 47
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["width"] ?? null), "html", null, true);
        yield "\" />
   <input type=\"hidden\" name=\"height\" value=\"";
        // line 48
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["height"] ?? null), "html", null, true);
        yield "\" />
   <input type=\"hidden\" name=\"card_options\" value=\"";
        // line 49
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(json_encode(($context["card_options"] ?? null), Twig\Extension\CoreExtension::constant("JSON_HEX_QUOT")), "html", null, true);
        yield "\" />

   ";
        // line 51
        yield $macros["fields"]->getTemplateForMacro("macro_colorField", $context, 51, $this->getSourceContext())->macro_colorField(...["color",         // line 53
($context["color"] ?? null), __("Background color"),         // line 55
($context["field_options"] ?? null)]);
        // line 56
        yield "

   ";
        // line 58
        yield $macros["fields"]->getTemplateForMacro("macro_dropdownArrayField", $context, 58, $this->getSourceContext())->macro_dropdownArrayField(...["card_id",         // line 60
($context["card_id"] ?? null),         // line 61
($context["list_cards"] ?? null), __("Data"), Twig\Extension\CoreExtension::merge(        // line 63
($context["field_options"] ?? null), ["display_emptychoice" =>  !        // line 64
($context["edit"] ?? null)])]);
        // line 66
        yield "

   ";
        // line 69
        yield "   ";
        $context["widgets_list"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
            // line 70
            yield "      <div class=\"widget-list\">
         ";
            // line 71
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable(($context["widget_types"] ?? null));
            foreach ($context['_seq'] as $context["key"] => $context["current"]) {
                // line 72
                yield "            ";
                $context["selected"] = ($context["key"] == ($context["widgettype"] ?? null));
                // line 73
                yield "            ";
                $context["w_displayed"] = ((($context["edit"] ?? null) && CoreExtension::getAttribute($this->env, $this->source, ($context["card"] ?? null), "widgettype", [], "array", true, true, false, 73)) && CoreExtension::inFilter($context["key"], (($_v0 = ($context["card"] ?? null)) && is_array($_v0) || $_v0 instanceof ArrayAccess ? ($_v0["widgettype"] ?? null) : null)));
                // line 74
                yield "
            <input type=\"radio\"
                  ";
                // line 76
                if ((($tmp = ($context["selected"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
                    yield "checked=\"checked\"";
                }
                // line 77
                yield "                  class=\"widget-select\" id=\"widgettype_";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["key"], "html", null, true);
                yield "_";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["rand"] ?? null), "html", null, true);
                yield "\"
                  name=\"widgettype\"
                  value=\"";
                // line 79
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["key"], "html", null, true);
                yield "\" />
               <label for=\"widgettype_";
                // line 80
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["key"], "html", null, true);
                yield "_";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["rand"] ?? null), "html", null, true);
                yield "\"
                      ";
                // line 81
                if ((($tmp = ($context["w_displayed"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
                    yield "style=\"display: inline-block;\"";
                }
                yield ">
                  <div>";
                // line 82
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($_v1 = $context["current"]) && is_array($_v1) || $_v1 instanceof ArrayAccess ? ($_v1["label"] ?? null) : null), "html", null, true);
                yield "</div>
                  <img src=\"";
                // line 83
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($_v2 = $context["current"]) && is_array($_v2) || $_v2 instanceof ArrayAccess ? ($_v2["image"] ?? null) : null), "html", null, true);
                yield "\" />
               </label>
         ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['key'], $context['current'], $context['_parent']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 86
            yield "      </div>
   ";
            yield from [];
        })())) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 88
        yield "
   ";
        // line 89
        $context["displayed"] = ($context["edit"] ?? null);
        // line 90
        yield "   <div class=\"widgettype_field\" ";
        if ((($tmp =  !($context["displayed"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            yield "style=\"display: none;\"";
        }
        yield ">
      ";
        // line 91
        yield $macros["fields"]->getTemplateForMacro("macro_field", $context, 91, $this->getSourceContext())->macro_field(...["",         // line 93
($context["widgets_list"] ?? null), __("Widget"),         // line 95
($context["field_options"] ?? null)]);
        // line 96
        yield "
   </div>

   ";
        // line 99
        $context["palette_displayed"] = (($context["edit"] ?? null) && (((CoreExtension::getAttribute($this->env, $this->source, ($context["widget_def"] ?? null), "haspalette", [], "array", true, true, false, 99) &&  !(null === (($_v3 = ($context["widget_def"] ?? null)) && is_array($_v3) || $_v3 instanceof ArrayAccess ? ($_v3["haspalette"] ?? null) : null)))) ? ((($_v4 = ($context["widget_def"] ?? null)) && is_array($_v4) || $_v4 instanceof ArrayAccess ? ($_v4["haspalette"] ?? null) : null)) : (false)));
        // line 100
        yield "   ";
        $context["palette_disabled"] = ($context["use_gradient"] ?? null);
        // line 101
        yield "   ";
        $context["palettes"] = $this->extensions['Glpi\Application\View\Extension\PhpExtension']->call("Glpi\\Dashboard\\Palette::getAllPalettes");
        // line 102
        yield "    <div class=\"palette_field\" ";
        if ((($tmp =  !($context["palette_displayed"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            yield "style=\"display: none;\"";
        }
        yield ">
        ";
        // line 103
        $context["palette_field"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
            // line 104
            yield "            ";
            $context["palette_field_id"] = ("palette_select" . Twig\Extension\CoreExtension::random($this->env->getCharset()));
            // line 105
            yield "            ";
            $context["gradient_field_id"] = ("use_gradient" . Twig\Extension\CoreExtension::random($this->env->getCharset()));
            // line 106
            yield "
            <select name=\"palette\" id=\"";
            // line 107
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["palette_field_id"] ?? null), "html", null, true);
            yield "\"
                    ";
            // line 108
            yield (((($tmp = ($context["palette_disabled"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) ? ("disabled=\"disabled\"") : (""));
            yield ">
            ";
            // line 109
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable(($context["palettes"] ?? null));
            foreach ($context['_seq'] as $context["palette_id"] => $context["palette_codes"]) {
                // line 110
                yield "                <option value=\"";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["palette_id"], "html", null, true);
                yield "\" ";
                if (($context["palette_id"] == ((array_key_exists("palette", $context)) ? (Twig\Extension\CoreExtension::default(($context["palette"] ?? null), "tab10")) : ("tab10")))) {
                    yield "selected";
                }
                yield ">
                    ";
                // line 111
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["palette_id"], "html", null, true);
                yield "
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['palette_id'], $context['palette_codes'], $context['_parent']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 113
            yield "            </select>

            <script>
                \$(function() {
                    const palettes = ";
            // line 117
            yield json_encode(($context["palettes"] ?? null));
            yield ";
                    const palette_template = function(option) {
                        const palette_codes = palettes[option.id] ?? [];
                        let html = '<span class=\"palette_preview d-inline-flex rounded overflow-hidden m-1\" \\
                            style=\"direction: ltr;\">';
                        for (const code of palette_codes) {
                            html += '<span class=\"palette_preview_color flex-fill\" \\
                            style=\"background-color: ' + _.escape(code) + '; height: 25px\" \\
                            title=\"' + _.escape(option.id) + '\"></span>';
                        }
                        html += '</span>';

                        return \$(html);
                    };

                    \$('#";
            // line 132
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["palette_field_id"] ?? null), "html", null, true);
            yield "').select2({
                        'width': '100%',
                        'templateResult': palette_template,
                        'templateSelection': palette_template,
                        'minimumResultsForSearch': 'Infinity', // no search box
                    });

                    \$('#";
            // line 139
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["gradient_field_id"] ?? null), "html", null, true);
            yield "').on('change', function() {
                        const disabled = \$(this).is(':checked');
                        \$('#";
            // line 141
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["palette_field_id"] ?? null), "html", null, true);
            yield "').prop('disabled', disabled);
                    });
                });
            </script>
        ";
            yield from [];
        })())) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 146
        yield "
        ";
        // line 147
        $context["gradient_field"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
            // line 148
            yield "            ";
            // line 149
            yield "            ";
            $context["gradient_displayed"] = (($context["edit"] ?? null) && ((CoreExtension::getAttribute($this->env, $this->source, ($context["widget_def"] ?? null), "gradient", [], "array", true, true, false, 149)) ? (Twig\Extension\CoreExtension::default((($_v5 = ($context["widget_def"] ?? null)) && is_array($_v5) || $_v5 instanceof ArrayAccess ? ($_v5["gradient"] ?? null) : null), false)) : (false)));
            // line 150
            yield "            <div class=\"gradient_field\" ";
            if ((($tmp =  !($context["gradient_displayed"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
                yield "style=\"display: none;\"";
            }
            yield ">
                <div class=\"form-check\">
                    <input type=\"hidden\" name=\"use_gradient\" value=\"0\" />
                    <input type=\"checkbox\"
                           name=\"use_gradient\"
                           class=\"form-check-input\"
                           id=\"";
            // line 156
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["gradient_field_id"] ?? null), "html", null, true);
            yield "\"
                           ";
            // line 157
            yield (((($context["use_gradient"] ?? null) == 1)) ? ("checked") : (""));
            yield "
                           value=\"1\">
                    <label class=\"form-check-label\" for=\"";
            // line 159
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["gradient_field_id"] ?? null), "html", null, true);
            yield "\">
                        ";
            // line 160
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("Use gradient palette"), "html", null, true);
            yield "
                        <span class=\"form-help\"
                              data-bs-toggle=\"tooltip\"
                              data-bs-placement=\"top\"
                              data-bs-title=\"";
            // line 164
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("generate a palette from the background color"), "html", null, true);
            yield "\">
                            ?
                        </span>
                    </label>
                </div>
            </div>
        ";
            yield from [];
        })())) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 171
        yield "
        ";
        // line 172
        yield $macros["fields"]->getTemplateForMacro("macro_htmlField", $context, 172, $this->getSourceContext())->macro_htmlField(...["palette",         // line 174
($context["palette_field"] ?? null), __("Use palette"), Twig\Extension\CoreExtension::merge(        // line 176
($context["field_options"] ?? null), ["add_field_html" =>         // line 177
($context["gradient_field"] ?? null)])]);
        // line 179
        yield "
    </div>

   ";
        // line 183
        yield "   ";
        $context["point_labels_displayed"] = (($context["edit"] ?? null) && ((CoreExtension::getAttribute($this->env, $this->source, ($context["widget_def"] ?? null), "pointlbl", [], "array", true, true, false, 183)) ? (Twig\Extension\CoreExtension::default((($_v6 = ($context["widget_def"] ?? null)) && is_array($_v6) || $_v6 instanceof ArrayAccess ? ($_v6["pointlbl"] ?? null) : null), false)) : (false)));
        // line 184
        yield "   <div class=\"pointlbl_field\" ";
        if ((($tmp =  !($context["point_labels_displayed"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            yield "style=\"display: none;\"";
        }
        yield ">
      ";
        // line 185
        yield $macros["fields"]->getTemplateForMacro("macro_checkboxField", $context, 185, $this->getSourceContext())->macro_checkboxField(...["point_labels",         // line 187
($context["point_labels"] ?? null), __("Display value labels on points/bars"),         // line 189
($context["field_options"] ?? null)]);
        // line 190
        yield "
   </div>

   ";
        // line 194
        yield "   ";
        $context["labels_displayed"] = (($context["edit"] ?? null) && ((CoreExtension::getAttribute($this->env, $this->source, ($context["widget_def"] ?? null), "labels", [], "array", true, true, false, 194)) ? (Twig\Extension\CoreExtension::default((($_v7 = ($context["widget_def"] ?? null)) && is_array($_v7) || $_v7 instanceof ArrayAccess ? ($_v7["labels"] ?? null) : null), false)) : (false)));
        // line 195
        yield "   <div class=\"label_field\" ";
        if ((($tmp =  !($context["labels_displayed"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            yield "style=\"display: none;\"";
        }
        yield ">
      ";
        // line 196
        yield $macros["fields"]->getTemplateForMacro("macro_checkboxField", $context, 196, $this->getSourceContext())->macro_checkboxField(...["labels",         // line 198
($context["labels"] ?? null), __("Show labels on chart"),         // line 200
($context["field_options"] ?? null)]);
        // line 201
        yield "
   </div>

   ";
        // line 205
        yield "   ";
        $context["legend_displayed"] = (($context["edit"] ?? null) && ((CoreExtension::getAttribute($this->env, $this->source, ($context["widget_def"] ?? null), "legend", [], "array", true, true, false, 205)) ? (Twig\Extension\CoreExtension::default((($_v8 = ($context["widget_def"] ?? null)) && is_array($_v8) || $_v8 instanceof ArrayAccess ? ($_v8["legend"] ?? null) : null), false)) : (false)));
        // line 206
        yield "   <div class=\"label_field\" ";
        if ((($tmp =  !($context["legend_displayed"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            yield "style=\"display: none;\"";
        }
        yield ">
      ";
        // line 207
        yield $macros["fields"]->getTemplateForMacro("macro_checkboxField", $context, 207, $this->getSourceContext())->macro_checkboxField(...["legend",         // line 209
($context["legend"] ?? null), __("Show legend"),         // line 211
($context["field_options"] ?? null)]);
        // line 212
        yield "
   </div>

   ";
        // line 216
        yield "   ";
        $context["limit_displayed"] = (($context["edit"] ?? null) && ((CoreExtension::getAttribute($this->env, $this->source, ($context["widget_def"] ?? null), "limit", [], "array", true, true, false, 216)) ? (Twig\Extension\CoreExtension::default((($_v9 = ($context["widget_def"] ?? null)) && is_array($_v9) || $_v9 instanceof ArrayAccess ? ($_v9["limit"] ?? null) : null), false)) : (false)));
        // line 217
        yield "   <div class=\"limit_field\" ";
        if ((($tmp =  !($context["limit_displayed"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            yield "style=\"display: none;\"";
        }
        yield ">
      ";
        // line 218
        yield $macros["fields"]->getTemplateForMacro("macro_numberField", $context, 218, $this->getSourceContext())->macro_numberField(...["limit",         // line 220
($context["limit"] ?? null), __("Limit number of data"),         // line 222
($context["field_options"] ?? null)]);
        // line 223
        yield "
   </div>

   <div class=\"modal-footer\">
      <button type=\"submit\" class=\"btn btn-primary ";
        // line 227
        yield (((($tmp = ($context["edit"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) ? ("edit-widget") : ("add-widget"));
        yield "\">
         ";
        // line 228
        if ((($tmp = ($context["edit"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            // line 229
            yield "            <i class=\"ti ti-device-floppy\"></i>
            <span>";
            // line 230
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(_x("button", "Update"), "html", null, true);
            yield "</span>
         ";
        } else {
            // line 232
            yield "            <i class=\"ti ti-plus\"></i>
            <span>";
            // line 233
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(_x("button", "Add"), "html", null, true);
            yield "</span>
         ";
        }
        // line 235
        yield "      </button>
   </div>

</form>
";
        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "components/dashboard/widget_form.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable(): bool
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  464 => 235,  459 => 233,  456 => 232,  451 => 230,  448 => 229,  446 => 228,  442 => 227,  436 => 223,  434 => 222,  433 => 220,  432 => 218,  425 => 217,  422 => 216,  417 => 212,  415 => 211,  414 => 209,  413 => 207,  406 => 206,  403 => 205,  398 => 201,  396 => 200,  395 => 198,  394 => 196,  387 => 195,  384 => 194,  379 => 190,  377 => 189,  376 => 187,  375 => 185,  368 => 184,  365 => 183,  360 => 179,  358 => 177,  357 => 176,  356 => 174,  355 => 172,  352 => 171,  341 => 164,  334 => 160,  330 => 159,  325 => 157,  321 => 156,  309 => 150,  306 => 149,  304 => 148,  302 => 147,  299 => 146,  290 => 141,  285 => 139,  275 => 132,  257 => 117,  251 => 113,  243 => 111,  234 => 110,  230 => 109,  226 => 108,  222 => 107,  219 => 106,  216 => 105,  213 => 104,  211 => 103,  204 => 102,  201 => 101,  198 => 100,  196 => 99,  191 => 96,  189 => 95,  188 => 93,  187 => 91,  180 => 90,  178 => 89,  175 => 88,  170 => 86,  161 => 83,  157 => 82,  151 => 81,  145 => 80,  141 => 79,  133 => 77,  129 => 76,  125 => 74,  122 => 73,  119 => 72,  115 => 71,  112 => 70,  109 => 69,  105 => 66,  103 => 64,  102 => 63,  101 => 61,  100 => 60,  99 => 58,  95 => 56,  93 => 55,  92 => 53,  91 => 51,  86 => 49,  82 => 48,  78 => 47,  74 => 46,  70 => 45,  66 => 44,  62 => 43,  57 => 40,  55 => 39,  52 => 38,  50 => 35,  47 => 34,  45 => 33,  42 => 32,);
    }

    public function getSourceContext(): Source
    {
        return new Source("", "components/dashboard/widget_form.html.twig", "C:\\wamp64\\www\\glpi\\templates\\components\\dashboard\\widget_form.html.twig");
    }
}
